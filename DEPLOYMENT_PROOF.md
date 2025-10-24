# Base Hackathon 2025 - Deployment Proof

## Project: Piggyfi
**Decentralized Accountability Savings on Base**

---

## 🔗 Live Deployment

**Production URL:** https://base-hackathon-2025.vercel.app (or your actual Vercel URL)

**GitHub Repository:** https://github.com/Kennytsu/Base-Hackathon-2025

---

## 📝 Smart Contract Deployment

### Network Information
- **Network:** Base Sepolia Testnet
- **Chain ID:** 84532
- **RPC URL:** https://sepolia.base.org

### Contract Details
- **Contract Name:** SwearJar
- **Contract Address:** `0x0ec298fDdf45ca143B26bCd4fD4BE75D58d2E84B`
- **Deployment Transaction:** [View on BaseScan](https://sepolia.basescan.org/address/0x0ec298fDdf45ca143B26bCd4fD4BE75D58d2E84B)
- **Deployed By:** `0x[your deployer address]`
- **Block Number:** [deployment block number]

### Contract Verification
✅ **Verify Contract:** https://sepolia.basescan.org/address/0x0ec298fDdf45ca143B26bCd4fD4BE75D58d2E84B#code

---

## 🧪 Test Transactions

### Transaction 1: Contract Deployment
- **Type:** Contract Creation
- **Hash:** `[deployment tx hash]`
- **Status:** ✅ Success
- **View:** [BaseScan Link](https://sepolia.basescan.org/tx/[tx-hash])

### Transaction 2: Bond Deposit
- **Type:** `depositBond()`
- **Amount:** 0.01 ETH
- **Hash:** `[tx hash]`
- **Status:** ✅ Success
- **View:** [BaseScan Link](https://sepolia.basescan.org/tx/[tx-hash])

### Transaction 3: [Additional Test Transaction]
- **Type:** [Function name]
- **Hash:** `[tx hash]`
- **Status:** ✅ Success
- **View:** [BaseScan Link](https://sepolia.basescan.org/tx/[tx-hash])

---

## 🎯 Features Implemented

### Core Functionality
✅ **Smart Contract on Base Sepolia**
- Bond deposits and withdrawals
- Penalty application
- Pot management
- Event emissions

✅ **Frontend Application**
- Wallet connection via OnchainKit
- Piggybank creation and management
- Member management with wallet addresses
- Rule configuration (word bans, post quotas)
- Real-time dashboard

✅ **Farcaster Integration**
- @username lookup for members
- Automatic wallet address fetching
- Profile picture integration
- Farcaster authentication for invites

✅ **Onchain Interactions**
- Deposit bonds to smart contract
- Apply penalties onchain
- Withdraw pot funds
- All transactions on Base Sepolia

### User Flow
1. **Connect Wallet** - OnchainKit integration with Coinbase Smart Wallet
2. **Create Piggybank** - Set rules, add members, deposit entry stake
3. **Add Members** - Use Farcaster @username to auto-fetch profiles
4. **Invite Friends** - Share invite link for Farcaster auth + deposit
5. **Enforce Rules** - Manual or automated violation detection
6. **Distribute Pot** - Withdraw funds to group members

---

## 🏗️ Architecture

### Tech Stack
- **Smart Contracts:** Solidity 0.8.28
- **Blockchain:** Base Sepolia Testnet
- **Frontend:** Next.js 15.5.6 + React 19
- **UI Framework:** Tailwind CSS + Framer Motion
- **Wallet Integration:** OnchainKit (Coinbase)
- **Web3 Library:** Wagmi + Viem
- **Social Integration:** Farcaster via Neynar API
- **Backend:** Node.js + Express + SQLite (optional)
- **Deployment:** Vercel

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│              (Next.js + OnchainKit)                      │
└────────────┬─────────────────────┬─────────────────────┘
             │                     │
             │                     │
    ┌────────▼────────┐   ┌────────▼────────┐
    │  Farcaster API  │   │  Base Sepolia   │
    │   (Neynar)      │   │  Smart Contract │
    └─────────────────┘   └─────────────────┘
             │                     │
             │                     │
    ┌────────▼─────────────────────▼────────┐
    │        Backend (Optional)               │
    │  Violation Detection & Monitoring       │
    └─────────────────────────────────────────┘
```

---

## 📊 Contract Functions

### User Functions
- `depositBond()` - Deposit ETH as bond
- `withdrawBond(uint256 amount)` - Withdraw bond
- `getBond(address user)` - View user's bond

### Owner Functions (Group Admin)
- `applyPenalty(address user, uint256 amount)` - Apply penalty
- `withdrawPot(address to, uint256 amount)` - Withdraw pot funds
- `getPotBalance()` - View total pot

### Events
- `BondDeposited(address user, uint256 amount)`
- `ViolationPenalty(address user, uint256 amount)`
- `PotWithdrawn(address recipient, uint256 amount)`

---

## 🔐 Environment Variables

### Frontend (Vercel)
```
NEXT_PUBLIC_ONCHAINKIT_API_KEY=bWGevZvj/...
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0ec298fDdf45ca143B26bCd4fD4BE75D58d2E84B
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_NEYNAR_API_KEY=CC2E9B41-19DF-44D8-B672-F3E7E2CBFEA6
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### Backend (Optional - Railway/Render)
```
NEYNAR_API_KEY=CC2E9B41-19DF-44D8-B672-F3E7E2CBFEA6
PORT=8080
```

---

## 📸 Screenshots

### 1. Dashboard
![Dashboard](./screenshots/dashboard.png)
*Main dashboard showing active piggybanks*

### 2. Create Piggybank
![Create](./screenshots/create.png)
*Creating a new piggybank with Farcaster members*

### 3. Farcaster Lookup
![Farcaster](./screenshots/farcaster-lookup.png)
*@username lookup fetching profile and wallet*

### 4. Piggybank Detail
![Detail](./screenshots/piggybank-detail.png)
*Piggybank dashboard with leaderboard and violations*

---

## ✅ Hackathon Requirements

### Required Elements
- ✅ **Functioning onchain app** - Live on Vercel
- ✅ **Publicly accessible URL** - https://base-hackathon-2025.vercel.app
- ✅ **Open-source GitHub repo** - All code available
- ✅ **Deployed on Base testnet** - Contract on Base Sepolia
- ✅ **Proof of deployment** - This document + BaseScan links
- ⏳ **Video (1+ min)** - [Link to video]

### Recommended Integrations
- ✅ **Farcaster Integration** - @username lookup + auth
- ✅ **OnchainKit** - Wallet connection and identity
- ⏳ **Basenames** - Can be added
- ⏳ **Base Account** - Can be added

---

## 🎥 Video Demo

**Video URL:** [Your video link here]

**Video Includes:**
- Introduction to Piggyfi
- Problem statement (accountability in savings)
- Solution overview
- Live demo walkthrough
- Architecture explanation
- Base Sepolia transactions

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Git
- Wallet with Base Sepolia ETH

### Installation
```bash
# Clone repository
git clone https://github.com/Kennytsu/Base-Hackathon-2025.git
cd Base-Hackathon-2025

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your API keys

# Run development server
npm run dev
```

### Deployment
```bash
# Deploy to Vercel
vercel --prod

# Add environment variables in Vercel dashboard
```

---

## 📞 Contact

**Team:** [Your team name]
**Developer:** [Your name]
**Email:** [Your email]
**Twitter/X:** [Your handle]
**Farcaster:** [Your @username]

---

## 📜 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Base Team** - For the hackathon and amazing infrastructure
- **Coinbase** - For OnchainKit and developer tools
- **Farcaster/Neynar** - For social integration APIs
- **Vercel** - For hosting and deployment platform

---

**Built with ❤️ for Base Hackathon 2025**

