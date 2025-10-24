# 🔑 Setup Your Neynar API Key

Your Neynar API key: `CC2E9B41-19DF-44D8-B672-F3E7E2CBFEA6`

## Quick Setup (2 minutes)

### 1. Add to Frontend `.env.local`

Create or update `.env.local` in the **root directory**:

```bash
# OnchainKit API Key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=bWGevZvj/XG68WREdyJsYlhYrjAEX3VTN2UJ7NSKPnqTdwB1x84HFH1u6d2w1h88yii20Il61sTKXm72vxOSVQ==

# Smart Contract Address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0ec298fDdf45ca143B26bCd4fD4BE75D58d2E84B

# Environment
NEXT_PUBLIC_ENVIRONMENT=development

# Neynar API Key for Farcaster
NEXT_PUBLIC_NEYNAR_API_KEY=CC2E9B41-19DF-44D8-B672-F3E7E2CBFEA6

# Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### 2. Add to Backend `.env`

Create `backend/.env`:

```bash
# Neynar API Key
NEYNAR_API_KEY=CC2E9B41-19DF-44D8-B672-F3E7E2CBFEA6

# Port
PORT=8080
```

---

## ✅ Test It Now!

### Option 1: Test Farcaster Lookup (Without Backend)

```bash
# 1. Start frontend (if not already running)
npm run dev

# 2. Go to http://localhost:3000
# 3. Click "Create Piggybank"
# 4. In "Add Group Member", type: @dwr
# 5. Click "➕ Add Member"
# 6. Watch the magic! Profile pic and wallet appear! 🎉
```

### Option 2: Full Test with Violation Detection

```bash
# Terminal 1 - Start Backend
cd backend
npm install
npm start

# Terminal 2 - Start Frontend (if not running)
npm run dev

# Then:
# 1. Create piggybank with "No swearing" rule
# 2. Add yourself by Farcaster username
# 3. Post a cast with a banned word
# 4. Wait 30 seconds
# 5. Violation appears in dashboard! 🚨
```

---

## 🎯 What You Can Do Now

With your API key, you can:

✅ **Look up Farcaster users by @username**
- Type `@jessepollak` → get wallet + profile pic

✅ **Auto-fetch member profiles**
- Real profile pictures everywhere
- Automatic wallet address lookup

✅ **Farcaster authentication for invites**
- Friends sign in with @username
- Profile auto-populated

✅ **Automated violation detection** (with backend)
- Monitor member Farcaster casts
- Auto-detect rule violations
- Real-time notifications

---

## 🚀 Quick Commands

```bash
# Start everything
npm run dev                    # Frontend (port 3000)
cd backend && npm start        # Backend (port 8080)

# Test member lookup
# Go to app, create piggybank, add @dwr

# Test violation detection
# Backend must be running
# Post cast with banned word
# Wait 30 seconds
```

---

## 📖 Full Documentation

See `FARCASTER_INTEGRATION_COMPLETE.md` for:
- Complete feature guide
- API documentation
- Troubleshooting
- Architecture diagrams

---

## 🆘 Troubleshooting

### "User not found" error
- Make sure username is correct (e.g., `@dwr` or just `dwr`)
- User must have a Farcaster account
- Check API key is correct in `.env.local`

### Backend not detecting violations
- Ensure `NEYNAR_API_KEY` is in `backend/.env`
- Check backend is running: http://localhost:8080/health
- Members must have `fid` (Farcaster ID)
- Violations checked every 30 seconds

### Frontend can't connect to backend
- Check backend is running on port 8080
- Verify `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
- Check browser console for WebSocket errors

---

**Next Step:** Create `.env.local` and `backend/.env` with the keys above, then test with `@dwr`! 🎉

