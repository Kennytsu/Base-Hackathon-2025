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

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run compile` - Compile smart contracts
- `npm run deploy:sepolia` - Deploy to Base Sepolia testnet
- `npm run deploy:mainnet` - Deploy to Base mainnet (production)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── layout/            # Layout components (hero, cards, etc.)
│   ├── lib/               # Utilities and hooks
│   └── providers.tsx      # Blockchain providers (Wagmi, OnchainKit)
├── contracts/             # Solidity smart contracts
│   └── SwearJar.sol      # Main savings contract
├── scripts/              # Deployment scripts
├── lib/                  # Shared libraries
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

### Get OnchainKit API Key

1. Go to [Coinbase Developer Portal](https://portal.cdp.coinbase.com/)
2. Create a new project
3. Copy your API key

### Deploy Contract

1. Get Base Sepolia ETH from [faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
2. Add your private key to `.env`
3. Run `npm run deploy:sepolia`
4. Copy contract address to `.env.local`

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
