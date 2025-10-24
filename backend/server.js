import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  initDatabase, 
  createGroup, 
  getGroup, 
  addMember, 
  addRule,
  getGroupMembers,
  getGroupRules,
  getGroupViolations,
  updateViolationStatus
} from './db.js';
import { startMonitoring, checkGroup } from './farcaster-monitor.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

// Create HTTP server
const server = createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

// WebSocket connection tracking
const wsClients = new Map(); // groupId -> Set of ws clients

wss.on('connection', (ws) => {
  console.log('👤 WebSocket client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'subscribe' && data.groupId) {
        // Subscribe to group updates
        if (!wsClients.has(data.groupId)) {
          wsClients.set(data.groupId, new Set());
        }
        wsClients.get(data.groupId).add(ws);
        ws.groupId = data.groupId;
        console.log(`📡 Client subscribed to group: ${data.groupId}`);

        ws.send(JSON.stringify({
          type: 'subscribed',
          groupId: data.groupId,
        }));
      } else if (data.type === 'unsubscribe' && data.groupId) {
        // Unsubscribe from group updates
        if (wsClients.has(data.groupId)) {
          wsClients.get(data.groupId).delete(ws);
        }
        console.log(`📡 Client unsubscribed from group: ${data.groupId}`);
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    // Clean up subscriptions
    if (ws.groupId && wsClients.has(ws.groupId)) {
      wsClients.get(ws.groupId).delete(ws);
    }
    console.log('👋 WebSocket client disconnected');
  });
});

// WebSocket broadcast helper
const wsServer = {
  broadcastToGroup: (groupId, message) => {
    if (wsClients.has(groupId)) {
      const clients = wsClients.get(groupId);
      const messageStr = JSON.stringify(message);
      clients.forEach(client => {
        if (client.readyState === 1) { // OPEN
          client.send(messageStr);
        }
      });
      console.log(`📤 Broadcast to group ${groupId}: ${message.type}`);
    }
  },
};

// ===== API Routes =====

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Register a new group for monitoring
app.post('/groups', async (req, res) => {
  try {
    const { id, name, creatorAddress, inviteCode, entryStakeEth, createdAt, members, rules } = req.body;

    // Create group
    await createGroup({
      id,
      name,
      creatorAddress,
      inviteCode,
      entryStakeEth,
      createdAt: createdAt || Date.now(),
    });

    // Add members
    if (members && Array.isArray(members)) {
      for (const member of members) {
        await addMember({
          id: member.id,
          groupId: id,
          fid: member.fid,
          username: member.farcasterUsername?.replace('@', ''),
          address: member.address,
          displayName: member.name,
          pfpUrl: member.pfpUrl,
          joinedAt: member.joinedAt || Date.now(),
        });
      }
    }

    // Add rules
    if (rules && Array.isArray(rules)) {
      for (const rule of rules) {
        await addRule({
          id: rule.id,
          groupId: id,
          type: rule.type,
          label: rule.label,
          config: rule.config,
          penaltyEth: rule.penaltyEth,
        });
      }
    }

    console.log(`✅ Registered group: ${name} (${id})`);

    res.json({
      success: true,
      group: { id, name },
    });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get group dashboard
app.get('/groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const group = await getGroup(id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const members = await getGroupMembers(id);
    const rules = await getGroupRules(id);
    const violations = await getGroupViolations(id);

    res.json({
      group,
      members,
      rules,
      violations,
    });
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get violations for a group
app.get('/groups/:id/violations', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    const violations = await getGroupViolations(id, status);

    res.json({
      violations,
    });
  } catch (error) {
    console.error('Error fetching violations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Approve a violation (marks as ready for penalty)
app.post('/violations/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;

    await updateViolationStatus(id, 'approved');

    res.json({
      success: true,
      violationId: id,
    });
  } catch (error) {
    console.error('Error approving violation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mark violation as penalty applied (with tx hash)
app.post('/violations/:id/applied', async (req, res) => {
  try {
    const { id } = req.params;
    const { txHash } = req.body;

    await updateViolationStatus(id, 'applied', txHash);

    res.json({
      success: true,
      violationId: id,
      txHash,
    });
  } catch (error) {
    console.error('Error marking violation as applied:', error);
    res.status(500).json({ error: error.message });
  }
});

// Manual check of a group (on-demand)
app.post('/groups/:id/check', async (req, res) => {
  try {
    const { id } = req.params;

    await checkGroup(id, wsServer);

    res.json({
      success: true,
      message: 'Group check completed',
    });
  } catch (error) {
    console.error('Error checking group:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Piggyfi backend running on port ${PORT}`);
  console.log(`📡 WebSocket available at ws://localhost:${PORT}/ws`);
  
  // Start monitoring service
  startMonitoring(wsServer);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  wss.close(() => {
    server.close(() => {
      process.exit(0);
    });
  });
});

