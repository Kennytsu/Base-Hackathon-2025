/**
 * Rule Engine for checking Farcaster casts against piggybank rules
 */

/**
 * Check if a cast violates a word ban rule
 */
export function checkWordBan(castText, bannedWords) {
  if (!castText || !bannedWords || bannedWords.length === 0) {
    return { violated: false };
  }

  const text = castText.toLowerCase();
  const violations = [];

  for (const word of bannedWords) {
    const wordLower = word.toLowerCase();
    // Use word boundaries to match whole words
    const regex = new RegExp(`\\b${wordLower}\\b`, 'i');
    if (regex.test(text)) {
      violations.push(word);
    }
  }

  return {
    violated: violations.length > 0,
    matchedWords: violations,
    details: violations.length > 0 ? `Banned words found: ${violations.join(', ')}` : null,
  };
}

/**
 * Check if a member violates post quota rule
 */
export function checkPostQuota(memberCasts, minPostsRequired, periodHours = 168) {
  // periodHours defaults to 168 (1 week)
  const now = Date.now();
  const periodStart = now - periodHours * 60 * 60 * 1000;

  // Count casts within the period
  const castsInPeriod = memberCasts.filter(cast => {
    const castTime = new Date(cast.timestamp).getTime();
    return castTime >= periodStart;
  });

  const actualPosts = castsInPeriod.length;
  const violated = actualPosts < minPostsRequired;

  return {
    violated,
    actualPosts,
    requiredPosts: minPostsRequired,
    details: violated
      ? `Posted ${actualPosts}/${minPostsRequired} required posts in the last ${periodHours / 24} days`
      : null,
  };
}

/**
 * Check if a cast violates custom rule
 * (placeholder for future custom rule logic)
 */
export function checkCustomRule(castText, config) {
  // For now, custom rules are just descriptive
  // In the future, you could add regex patterns, sentiment analysis, etc.
  return {
    violated: false,
    details: 'Custom rule checking not yet implemented',
  };
}

/**
 * Main function to check all rules for a group against a member's casts
 */
export function checkRulesForMember(member, casts, rules) {
  const violations = [];

  for (const rule of rules) {
    let result = { violated: false };

    switch (rule.type) {
      case 'WORD_BAN':
        // Check each cast for banned words
        for (const cast of casts) {
          result = checkWordBan(cast.text, rule.config.bannedWords);
          if (result.violated) {
            violations.push({
              ruleId: rule.id,
              ruleLabel: rule.label,
              penaltyEth: rule.penalty_eth,
              castHash: cast.hash,
              castText: cast.text,
              details: result.details,
              matchedWords: result.matchedWords,
            });
          }
        }
        break;

      case 'POST_QUOTA':
        result = checkPostQuota(casts, rule.config.minPostsPerWeek, 168);
        if (result.violated) {
          violations.push({
            ruleId: rule.id,
            ruleLabel: rule.label,
            penaltyEth: rule.penalty_eth,
            castHash: null, // No specific cast for quota violations
            castText: null,
            details: result.details,
            actualPosts: result.actualPosts,
            requiredPosts: result.requiredPosts,
          });
        }
        break;

      case 'CUSTOM':
        // Custom rules can be checked in the future
        result = checkCustomRule(casts[0]?.text, rule.config);
        if (result.violated) {
          violations.push({
            ruleId: rule.id,
            ruleLabel: rule.label,
            penaltyEth: rule.penalty_eth,
            castHash: casts[0]?.hash,
            castText: casts[0]?.text,
            details: result.details,
          });
        }
        break;

      default:
        console.warn(`Unknown rule type: ${rule.type}`);
    }
  }

  return violations;
}

/**
 * Batch check all members in a group
 */
export async function checkGroupViolations(members, memberCasts, rules) {
  const allViolations = [];

  for (const member of members) {
    const casts = memberCasts[member.fid] || [];
    const violations = checkRulesForMember(member, casts, rules);

    for (const violation of violations) {
      allViolations.push({
        ...violation,
        memberId: member.id,
        memberFid: member.fid,
        memberName: member.display_name || member.username,
        detectedAt: Date.now(),
      });
    }
  }

  return allViolations;
}

