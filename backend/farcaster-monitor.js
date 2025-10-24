import fetch from 'node-fetch';
import { getActiveGroups, getGroupMembers, getGroupRules, createViolation, updateMonitoringState, getMonitoringState } from './db.js';
import { checkGroupViolations } from './rule-engine.js';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2';
const POLL_INTERVAL = 30000; // 30 seconds

/**
 * Fetch recent casts for a Farcaster user
 */
async function getUserCasts(fid, limit = 25) {
  if (!NEYNAR_API_KEY) {
    console.error('❌ NEYNAR_API_KEY not set');
    return [];
  }

  try {
    const response = await fetch(
      `${NEYNAR_BASE_URL}/farcaster/feed/user/${fid}/casts?limit=${limit}`,
      {
        headers: {
          'api_key': NEYNAR_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const casts = data.casts || [];

    return casts.map(cast => ({
      hash: cast.hash,
      text: cast.text,
      timestamp: cast.timestamp,
      author: {
        fid: cast.author.fid,
        username: cast.author.username,
      },
    }));
  } catch (error) {
    console.error(`Failed to fetch casts for FID ${fid}:`, error.message);
    return [];
  }
}

/**
 * Monitor a single group for violations
 */
async function monitorGroup(group, wsServer) {
  try {
    // Get members and rules
    const members = await getGroupMembers(group.id);
    const rules = await getGroupRules(group.id);

    if (members.length === 0 || rules.length === 0) {
      console.log(`⏭️  Skipping group ${group.name} (no members or rules)`);
      return;
    }

    // Get monitoring state
    const state = await getMonitoringState(group.id);
    const lastCheck = state?.last_check_timestamp || Date.now() - 24 * 60 * 60 * 1000; // Last 24 hours if first check

    console.log(`🔍 Monitoring group: ${group.name} (${members.length} members, ${rules.length} rules)`);

    // Fetch casts for each member
    const memberCasts = {};
    for (const member of members) {
      if (!member.fid) {
        console.log(`  ⚠️  Skipping member ${member.display_name} (no FID)`);
        continue;
      }

      const casts = await getUserCasts(member.fid);
      // Filter casts since last check
      memberCasts[member.fid] = casts.filter(cast => {
        const castTime = new Date(cast.timestamp).getTime();
        return castTime > lastCheck;
      });

      console.log(`  📝 ${member.display_name} (@${member.username}): ${memberCasts[member.fid].length} new casts`);
    }

    // Check for violations
    const violations = await checkGroupViolations(members, memberCasts, rules);

    if (violations.length > 0) {
      console.log(`  ⚠️  Found ${violations.length} violations!`);

      // Save violations to database
      for (const violation of violations) {
        const violationId = `vio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await createViolation({
          id: violationId,
          groupId: group.id,
          memberId: violation.memberId,
          ruleId: violation.ruleId,
          castHash: violation.castHash,
          castText: violation.castText,
          detectedAt: violation.detectedAt,
        });

        // Broadcast to WebSocket clients
        if (wsServer) {
          wsServer.broadcastToGroup(group.id, {
            type: 'violation_detected',
            data: {
              id: violationId,
              groupId: group.id,
              groupName: group.name,
              member: {
                id: violation.memberId,
                name: violation.memberName,
                fid: violation.memberFid,
              },
              rule: {
                id: violation.ruleId,
                label: violation.ruleLabel,
              },
              cast: {
                hash: violation.castHash,
                text: violation.castText,
              },
              details: violation.details,
              penaltyEth: violation.penaltyEth,
              detectedAt: violation.detectedAt,
            },
          });
        }

        console.log(`  📊 Violation: ${violation.memberName} - ${violation.ruleLabel}`);
        if (violation.details) {
          console.log(`     Details: ${violation.details}`);
        }
      }
    } else {
      console.log(`  ✅ No violations detected`);
    }

    // Update monitoring state
    await updateMonitoringState(group.id, Date.now());

  } catch (error) {
    console.error(`Error monitoring group ${group.id}:`, error);
  }
}

/**
 * Main monitoring loop
 */
export async function startMonitoring(wsServer) {
  console.log('🚀 Starting Farcaster monitoring service...');

  if (!NEYNAR_API_KEY) {
    console.error('❌ NEYNAR_API_KEY not set. Monitoring disabled.');
    return;
  }

  // Monitor immediately on start
  await monitorAllGroups(wsServer);

  // Then set up interval
  setInterval(async () => {
    await monitorAllGroups(wsServer);
  }, POLL_INTERVAL);

  console.log(`✅ Monitoring service started (polling every ${POLL_INTERVAL / 1000}s)`);
}

/**
 * Monitor all active groups
 */
async function monitorAllGroups(wsServer) {
  try {
    const groups = await getActiveGroups();
    console.log(`\n📊 Checking ${groups.length} active groups...`);

    for (const group of groups) {
      await monitorGroup(group, wsServer);
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('Error monitoring groups:', error);
  }
}

/**
 * On-demand check for a specific group
 */
export async function checkGroup(groupId, wsServer) {
  try {
    const { getGroup } = await import('./db.js');
    const group = await getGroup(groupId);
    if (!group) {
      throw new Error('Group not found');
    }
    await monitorGroup(group, wsServer);
    return { success: true };
  } catch (error) {
    console.error(`Error checking group ${groupId}:`, error);
    throw error;
  }
}

