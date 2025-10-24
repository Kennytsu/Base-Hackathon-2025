# Piggyfi Backend

Violation detection and monitoring service for Piggyfi piggybanks.

## Features

- 🔍 **Farcaster Monitoring** - Polls Farcaster API for member casts
- ⚖️ **Rule Engine** - Checks casts against word bans, post quotas, and custom rules
- 📊 **Violation Tracking** - Stores detected violations in SQLite database
- 📡 **WebSocket Updates** - Real-time violation notifications to frontend
- 🚀 **REST API** - Endpoints for registering groups and managing violations

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create Environment File

Create a `.env` file in the `backend` directory:

```bash
# Neynar API Key for Farcaster
NEYNAR_API_KEY=your_neynar_api_key_here

# Port (optional, defaults to 8080)
PORT=8080
```

Get your Neynar API key at: https://neynar.com (free tier: 100 requests/min)

### 3. Start the Server

```bash
npm start
```

The server will start on port 8080 and begin monitoring registered piggybanks.

## API Endpoints

### Health Check
```
GET /health
```

### Register Group for Monitoring
```
POST /groups
Body: {
  id, name, creatorAddress, inviteCode, entryStakeEth, 
  createdAt, members[], rules[]
}
```

### Get Group Dashboard
```
GET /groups/:id
```

### Get Group Violations
```
GET /groups/:id/violations?status=pending
```

### Approve Violation
```
POST /violations/:id/approve
```

### Mark Penalty Applied
```
POST /violations/:id/applied
Body: { txHash }
```

### Manual Group Check
```
POST /groups/:id/check
```

## WebSocket

Connect to `ws://localhost:8080/ws`

### Subscribe to Group
```json
{ "type": "subscribe", "groupId": "group-id" }
```

### Violation Notification
```json
{
  "type": "violation_detected",
  "data": {
    "id": "vio-xxx",
    "groupId": "group-id",
    "member": { ... },
    "rule": { ... },
    "cast": { ... },
    "penaltyEth": 0.002,
    "detectedAt": 1234567890
  }
}
```

## Database

SQLite database (`piggyfi.db`) with tables:
- `groups` - Registered piggybanks
- `members` - Group members with Farcaster data
- `rules` - Piggybank rules
- `violations` - Detected violations
- `monitoring_state` - Last check timestamps

## Monitoring

The service polls Farcaster every 30 seconds for new casts from group members and checks them against rules.

Rule types supported:
- **WORD_BAN** - Checks for banned words in casts
- **POST_QUOTA** - Checks if member posted minimum required times
- **CUSTOM** - Placeholder for future custom rules

## Development

Watch mode (auto-restart on changes):
```bash
npm run dev
```

## Deployment

Deploy to Railway, Render, or any Node.js hosting service. Set environment variables in your hosting dashboard.

## License

MIT

