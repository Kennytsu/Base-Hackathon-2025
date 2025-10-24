# Environment Setup Guide for Piggyfi

This guide will help you set up all the necessary environment variables to run Piggyfi locally and deploy it to Base.

## 📋 Required Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```bash
# OnchainKit API Key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

# Smart Contract Address
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address_here

# Environment (development or production)
NEXT_PUBLIC_ENVIRONMENT=development

# Deployment URL (optional for local, auto-populated by Vercel)
NEXT_PUBLIC_URL=
```

---

## 🔑 Getting Your API Keys

### 1. OnchainKit API Key

OnchainKit is Coinbase's SDK for building onchain applications.

**Steps:**
1. Go to [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Sign in with your Coinbase account (or create one)
3. Navigate to "API Keys" or "Projects"
4. Create a new project called "Piggyfi"
5. Copy the API key
6. Paste it as `NEXT_PUBLIC_ONCHAINKIT_API_KEY` in your `.env.local`

**Note:** This key is needed for wallet connections and Base chain interactions.

---

## 📦 Deploying Your Smart Contract

Before you can use the app, you need to deploy the `SwearJar.sol` contract to Base Sepolia (testnet) or Base Mainnet.

### Option 1: Deploy to Base Sepolia (Testnet) - Recommended for Testing

1. **Get Base Sepolia ETH:**
   - Go to [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
   - Or [Alchemy Faucet](https://sepoliafaucet.com/)
   - Get some test ETH for gas fees

2. **Set up your deployment wallet:**
   ```bash
   # Create a .env file in the root (NOT .env.local)
   echo "PRIVATE_KEY=your_wallet_private_key_here" > .env
   ```

   ⚠️ **Security Warning:** Never commit `.env` to git! It's already in `.gitignore`.

3. **Deploy the contract:**
   ```bash
   npm run deploy:sepolia
   ```

4. **Copy the deployed contract address:**
   - After deployment, you'll see: `SwearJar deployed to: 0x...`
   - Copy this address and paste it as `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`

### Option 2: Deploy to Base Mainnet (Production)

1. **Get Base ETH:**
   - Bridge ETH to Base using [Base Bridge](https://bridge.base.org/)
   - You'll need real ETH for gas fees

2. **Deploy:**
   ```bash
   npm run deploy:mainnet
   ```

3. **Copy the contract address to `.env.local`**

---

## 🌐 Environment Configuration

### For Local Development

```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_key_here
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_ENVIRONMENT=development  # Uses Base Sepolia
```

### For Production (Vercel)

Add these environment variables in your Vercel project settings:

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_ENVIRONMENT` = `production` (Uses Base Mainnet)

Vercel will auto-populate:
- `NEXT_PUBLIC_URL` with your deployment URL
- `VERCEL_PROJECT_PRODUCTION_URL` with your project URL

---

## 🔍 Verifying Your Setup

### 1. Check if environment variables are loaded:

```bash
# Run locally
npm run dev
```

Open the browser console and run:
```javascript
console.log({
  apiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ? '✓ Set' : '✗ Missing',
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '✗ Missing',
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development'
});
```

### 2. Test wallet connection:

1. Open http://localhost:3000
2. Click "Connect Wallet"
3. You should see the Coinbase Smart Wallet modal
4. Connect your wallet
5. You should see your address and balance

### 3. Test contract interaction:

1. After connecting wallet, try creating a piggybank
2. You should be prompted to deposit a bond
3. Confirm the transaction
4. Check your wallet - you should see the transaction

---

## ⚠️ Common Issues

### Issue: "Wallet connection not working"

**Solution:**
- Make sure `NEXT_PUBLIC_ONCHAINKIT_API_KEY` is set
- Check browser console for errors
- Try clearing browser cache and cookies

### Issue: "Contract not found"

**Solution:**
- Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` is correct
- Make sure the contract is deployed to the right network (Sepolia vs Mainnet)
- Check `NEXT_PUBLIC_ENVIRONMENT` matches your deployment

### Issue: "Transaction failing"

**Solution:**
- Make sure you have enough ETH for gas fees
- Check if you're connected to the right network (Base Sepolia or Base Mainnet)
- Verify the contract address is correct

### Issue: "API key invalid"

**Solution:**
- Double-check your OnchainKit API key is copied correctly
- Make sure there are no extra spaces
- Try regenerating the key in the Coinbase Developer Portal

---

## 📝 Example `.env.local` File

```bash
# Copy this template and fill in your values

# OnchainKit API Key (from https://portal.cdp.coinbase.com/)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=

# Contract Address (from deployment output)
NEXT_PUBLIC_CONTRACT_ADDRESS=

# Environment (development = Base Sepolia, production = Base Mainnet)
NEXT_PUBLIC_ENVIRONMENT=development

# URL (optional for local, auto-set by Vercel)
NEXT_PUBLIC_URL=
```

---

## 🚀 Next Steps

Once your environment is set up:

1. ✅ Run locally: `npm run dev`
2. ✅ Test wallet connection
3. ✅ Test creating a piggybank
4. ✅ Test recording infractions
5. ✅ Deploy to Vercel (see `DEPLOYMENT_GUIDE.md`)

---

## 📚 Additional Resources

- [OnchainKit Documentation](https://onchainkit.xyz/)
- [Base Documentation](https://docs.base.org/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Hardhat Documentation](https://hardhat.org/)
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

---

## 🆘 Need Help?

If you're stuck, check:
1. Console logs in browser developer tools
2. Terminal output for errors
3. [Base Discord](https://discord.gg/buildonbase)
4. [OnchainKit GitHub](https://github.com/coinbase/onchainkit)

---

**You're all set!** Once you have these environment variables configured, your Piggyfi app will be ready to run. 🎉

