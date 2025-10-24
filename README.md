# Piggyfi - Smart Savings on Base

A social accountability savings app built on Base blockchain. Create piggybanks, set savings goals, and stay accountable with friends through onchain penalties.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS
- **Blockchain**: Base (L2), Wagmi, OnchainKit, Viem
- **Smart Contracts**: Solidity, Hardhat
- **Wallet**: Coinbase Smart Wallet

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env.local` file:

```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_ENVIRONMENT=development
```

Create `.env` file for Hardhat:

```bash
PRIVATE_KEY=your_wallet_private_key
```

### 3. Deploy Smart Contract (First Time Only)

```bash
# Compile contracts
npm run compile

# Deploy to Base Sepolia testnet
npm run deploy:sepolia
```

Copy the deployed contract address to `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

### Frontend
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server

### Smart Contracts
- `npm run compile` - Compile smart contracts
- `npm run deploy:sepolia` - Deploy to Base Sepolia testnet
- `npm run deploy:mainnet` - Deploy to Base mainnet (production)

### Backend (Violation Detection)
- `cd backend && npm start` - Start backend server
- `cd backend && npm run dev` - Start in watch mode

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── layout/            # Layout components (hero, cards, etc.)
│   ├── lib/               # Utilities and hooks
│   ├── join/[code]/       # Invite join page
│   └── providers.tsx      # Blockchain providers (Wagmi, OnchainKit)
├── backend/               # Violation detection service
│   ├── server.js          # Express server
│   ├── db.js              # SQLite database
│   ├── farcaster-monitor.js  # Monitoring service
│   ├── rule-engine.js     # Rule checking logic
│   └── package.json       # Backend dependencies
├── contracts/             # Solidity smart contracts
│   └── SwearJar.sol      # Main savings contract
├── scripts/              # Deployment scripts
├── lib/                  # Shared libraries
│   ├── farcaster.ts      # Farcaster API client
│   └── hooks/           # Custom React hooks
└── public/              # Static assets

```

## Key Features

- 🏦 **Create Piggybanks** - Set up savings groups with friends
- 📋 **Custom Rules** - Define accountability rules (word bans, post quotas, etc.)
- 💰 **Onchain Deposits** - All funds secured by smart contracts on Base
- ⚖️ **Penalty System** - Automatic penalties for rule violations
- 👥 **Social Accountability** - Invite friends to join your savings goals
- 🔒 **Secure Withdrawals** - Access funds after period ends

## Smart Contract

The `SwearJar.sol` contract handles:
- Bond deposits from users
- Penalty application for violations
- Pot balance management
- Secure withdrawals

Deployed on **Base Sepolia** for testing.

## Environment Setup

### Get API Keys

#### OnchainKit API Key (Required)
1. Go to [Coinbase Developer Portal](https://portal.cdp.coinbase.com/)
2. Create a new project
3. Copy your API key to `.env.local`

#### Neynar API Key (Required for Farcaster features)
1. Go to [Neynar](https://neynar.com)
2. Sign up for free account (100 requests/min)
3. Copy your API key to `.env.local` and `backend/.env`

### Deploy Smart Contract

1. Get Base Sepolia ETH from [faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
2. Add your private key to `.env`
3. Run `npm run compile`
4. Run `npm run deploy:sepolia`
5. Copy contract address to `.env.local`

### Start Backend (Optional for violation detection)

1. Create `backend/.env` with `NEYNAR_API_KEY`
2. Run `cd backend && npm install`
3. Run `npm start`
4. Backend runs on `http://localhost:8080`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Built for Base Hackathon 2025

Leveraging Base's L2 scaling for affordable onchain accountability.

## License

MIT
