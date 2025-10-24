# Production Setup Instructions for Piggyfi

Follow these steps to configure your Piggyfi mini app for production deployment on Base.

---

## Prerequisites

Before starting, make sure you have:
- Node.js 18+ installed
- Git repository set up
- Vercel account for deployment
- Coinbase account (for OnchainKit API key)
- MetaMask or compatible wallet with some test ETH

---

## Step 1: Get OnchainKit API Key

OnchainKit is required for wallet connections and Base chain interactions.

### Instructions:

1. **Go to Coinbase Developer Platform**
   - Visit: https://portal.cdp.coinbase.com/
   - Sign in with your Coinbase account (create one if needed)

2. **Create a New Project**
   - Click "Create Project" or "New Project"
   - Name it "Piggyfi" or your preferred name
   - Select "OnchainKit" as the project type

3. **Generate API Key**
   - Navigate to "API Keys" section
   - Click "Create API Key"
   - **Important:** Copy the key immediately - it won't be shown again!
   - Keep this key secure

4. **Save the Key**
   - You'll use this as `NEXT_PUBLIC_ONCHAINKIT_API_KEY`

---

## Step 2: Deploy SwearJar Contract to Base Sepolia

Your app needs a deployed smart contract to function.

### Get Test ETH First:

1. **Base Sepolia Faucet**
   - Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - Or: https://sepoliafaucet.com/
   - Connect your wallet
   - Request test ETH (you'll need ~0.01 ETH for deployment)

### Deploy the Contract:

1. **Set Up Private Key**
   ```bash
   # In your project root, create .env file (NOT .env.local)
   echo "PRIVATE_KEY=your_wallet_private_key_here" > .env
   ```

   **Warning:** Never commit `.env` to git! It's already in `.gitignore`.

   **How to get your private key:**
   - MetaMask: Account Details → Export Private Key
   - Use a test wallet, not your main wallet!

2. **Install Dependencies** (if not done already)
   ```bash
   npm install
   ```

3. **Deploy to Base Sepolia**
   ```bash
   npm run deploy:sepolia
   ```

4. **Copy the Contract Address**
   - After deployment completes, you'll see:
     ```
     SwearJar deployed to: 0xABCDEF...
     ```
   - **Copy this entire address!**
   - You'll use this as `NEXT_PUBLIC_CONTRACT_ADDRESS`

5. **Verify Deployment (Optional)**
   - Visit: https://sepolia.basescan.org/
   - Paste your contract address to verify it's deployed

---

## Step 3: Create Local Environment File

Create a `.env.local` file in your project root:

```bash
# OnchainKit API Key (from Step 1)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

# Contract Address (from Step 2)
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere

# Environment (use 'development' for Base Sepolia testnet)
NEXT_PUBLIC_ENVIRONMENT=development

# Deployment URL (optional for local, auto-set by Vercel)
NEXT_PUBLIC_URL=
```

### Example `.env.local`:
```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=abc123def456ghi789
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
NEXT_PUBLIC_ENVIRONMENT=development
```

**Important:** 
- Don't add quotes around values
- Don't commit `.env.local` to git
- The environment variables must start with `NEXT_PUBLIC_` to be available in the browser

---

## Step 4: Test Locally

Before deploying to production, test everything locally:

```bash
# Start the development server
npm run dev
```

Open http://localhost:3000 and test:

### Testing Checklist:

- [ ] App loads without errors
- [ ] Click "Connect Wallet" button
- [ ] Coinbase Smart Wallet modal appears
- [ ] Can connect wallet successfully
- [ ] Wallet address displays in header
- [ ] Click "Create Your First Piggybank"
- [ ] Fill in piggybank details (name, rules, members)
- [ ] Click "Create & Deposit"
- [ ] Transaction approval modal appears
- [ ] Can approve and send transaction
- [ ] Transaction completes successfully
- [ ] Piggybank appears on dashboard
- [ ] Can view piggybank details
- [ ] Pot balance shows correctly

### Troubleshooting:

**Wallet not connecting?**
- Check `NEXT_PUBLIC_ONCHAINKIT_API_KEY` is set correctly
- Clear browser cache
- Try incognito mode

**Transaction failing?**
- Make sure you have test ETH
- Verify contract address is correct
- Check you're on Base Sepolia network

**"Contract not found" error?**
- Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` is correct
- Make sure contract is deployed (check BaseScan)
- Ensure `NEXT_PUBLIC_ENVIRONMENT=development`

---

## Step 5: Configure Vercel Environment Variables

Once local testing works, set up production:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Add Environment Variables**
   - Navigate to: Settings → Environment Variables
   - Add each variable:

   | Name | Value | Environments |
   |------|-------|-------------|
   | `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | Your API key from Step 1 | Production, Preview |
   | `NEXT_PUBLIC_CONTRACT_ADDRESS` | Your contract address from Step 2 | Production, Preview |
   | `NEXT_PUBLIC_ENVIRONMENT` | `development` (for Base Sepolia) | Production, Preview |

3. **Save Environment Variables**
   - Click "Save" for each variable

4. **Redeploy**
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - OR push new commit to trigger deployment

---

## Step 6: Turn Off Vercel Authentication

**Critical:** Base needs to access your manifest without authentication.

1. In Vercel Dashboard → Your Project
2. Go to: Settings → Deployment Protection
3. Toggle "Vercel Authentication" to **OFF**
4. Click "Save"

---

## Step 7: Deploy and Test Production

1. **Push to GitHub** (if not already)
   ```bash
   git add .
   git commit -m "Configure production environment"
   git push
   ```

2. **Wait for Vercel Deployment**
   - Check Vercel dashboard for deployment status
   - Should complete in 2-3 minutes

3. **Test Production App**
   - Visit your Vercel URL (e.g., `your-app.vercel.app`)
   - Test wallet connection
   - Test creating a piggybank
   - Test all features

---

## Step 8: Complete Base Mini App Integration

To publish on Base app:

1. **Get Account Association**
   - Visit: https://build.base.org/account-association
   - Enter your Vercel URL (without `https://`)
   - Click "Submit" → "Verify"
   - Sign with Farcaster
   - Copy the `accountAssociation` object

2. **Update minikit.config.ts**
   ```typescript
   accountAssociation: {
     "header": "eyJ...",    // Paste values here
     "payload": "eyJ...",
     "signature": "MHh..."
   }
   ```

3. **Push Changes**
   ```bash
   git add minikit.config.ts
   git commit -m "Add account association"
   git push
   ```

4. **Test at Preview Tool**
   - Visit: https://base.dev/preview
   - Enter your app URL
   - Verify everything works

5. **Publish to Base**
   - Create post in Base app with your URL
   - Your mini app will appear with rich preview

---

## For Production (Base Mainnet)

When ready to go live with real ETH:

1. **Deploy Contract to Base Mainnet**
   ```bash
   npm run deploy:mainnet
   ```
   - You'll need real ETH for gas fees
   - Copy the new mainnet contract address

2. **Update Vercel Environment Variables**
   - Change `NEXT_PUBLIC_CONTRACT_ADDRESS` to mainnet address
   - Change `NEXT_PUBLIC_ENVIRONMENT` to `production`

3. **Redeploy and Test**
   - Redeploy from Vercel
   - Test thoroughly with small amounts first

---

## Security Reminders

- ✅ Never commit `.env` or `.env.local` to git
- ✅ Never share your private keys
- ✅ Use test wallets for deployment
- ✅ Test on Sepolia before mainnet
- ✅ Start with small amounts on mainnet

---

## Need Help?

### Resources:
- OnchainKit Docs: https://onchainkit.xyz/
- Base Docs: https://docs.base.org/
- Base Discord: https://discord.gg/buildonbase
- Hardhat Docs: https://hardhat.org/

### Common Issues:
- Check console logs in browser DevTools
- Verify all environment variables are set
- Make sure contract is deployed
- Ensure you have test ETH
- Try clearing browser cache

---

## Quick Reference

### Required Environment Variables:
```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_key
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_ENVIRONMENT=development
```

### Test Commands:
```bash
npm run dev          # Local development
npm run build        # Test production build
npm run deploy:sepolia   # Deploy to testnet
npm run deploy:mainnet   # Deploy to mainnet
```

### Important URLs:
- OnchainKit Portal: https://portal.cdp.coinbase.com/
- Base Sepolia Faucet: https://www.coinbase.com/faucets/
- Base Sepolia Explorer: https://sepolia.basescan.org/
- Base Account Association: https://build.base.org/account-association
- Base Preview Tool: https://base.dev/preview

---

**You're all set!** Follow these steps in order and your Piggyfi app will be production-ready. 🚀

