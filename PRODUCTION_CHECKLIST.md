# Production Deployment Checklist

Use this checklist to ensure your Piggyfi mini app is properly configured before going live.

---

## Pre-Deployment Checklist

### Environment Setup
- [ ] Got OnchainKit API key from Coinbase Developer Portal
- [ ] Deployed SwearJar contract to Base Sepolia
- [ ] Copied contract address
- [ ] Created `.env.local` file with all required variables
- [ ] Verified `.env.local` is in `.gitignore`

### Local Testing
- [ ] Ran `npm install` successfully
- [ ] Ran `npm run dev` without errors
- [ ] App loads at http://localhost:3000
- [ ] No console errors in browser DevTools
- [ ] Wallet connection button appears
- [ ] Can connect Coinbase Smart Wallet
- [ ] Connected wallet address displays
- [ ] Can create a piggybank
- [ ] Transaction approval works
- [ ] Transaction completes successfully
- [ ] Piggybank appears on dashboard
- [ ] Can view piggybank details
- [ ] Pot balance shows correctly from contract

### Code Quality
- [ ] Removed all demo/seed data
- [ ] No hardcoded addresses or keys in code
- [ ] Empty state shows properly
- [ ] All TypeScript errors resolved
- [ ] Build completes with `npm run build`

---

## Vercel Deployment Checklist

### Repository Setup
- [ ] Code pushed to GitHub
- [ ] Project connected to Vercel
- [ ] Latest commit is deployed

### Environment Variables (Vercel)
- [ ] `NEXT_PUBLIC_ONCHAINKIT_API_KEY` set
- [ ] `NEXT_PUBLIC_CONTRACT_ADDRESS` set
- [ ] `NEXT_PUBLIC_ENVIRONMENT` set to `development`
- [ ] Environment variables applied to Production
- [ ] Environment variables applied to Preview
- [ ] Redeployed after setting variables

### Vercel Configuration
- [ ] Deployment Protection is OFF (Settings → Deployment Protection)
- [ ] "Vercel Authentication" toggled OFF
- [ ] Changes saved
- [ ] Latest deployment successful
- [ ] No build errors in Vercel logs

### Production URL
- [ ] Copied production URL (e.g., `your-app.vercel.app`)
- [ ] App loads at production URL
- [ ] No 404 or 500 errors
- [ ] Wallet connection works on production
- [ ] Can create piggybank on production
- [ ] Transactions work on production

---

## Base Mini App Integration

### Images
- [ ] Created app icon (512x512px) as `public/blue-icon.png`
- [ ] Created hero image (1200x630px) as `public/blue-hero.png`
- [ ] Created screenshot (750x1624px) as `public/screenshot-portrait.png`
- [ ] Images are high quality and represent your brand
- [ ] Images work on dark backgrounds

### Manifest Configuration
- [ ] `minikit.config.ts` has proper app name
- [ ] Description is clear and compelling
- [ ] Tags are relevant
- [ ] All image URLs point to production domain

### Account Association
- [ ] Visited https://build.base.org/account-association
- [ ] Entered production URL (without `https://`)
- [ ] Clicked "Submit" and "Verify"
- [ ] Signed with Farcaster account
- [ ] Copied `accountAssociation` object
- [ ] Updated `minikit.config.ts` with credentials
- [ ] Pushed changes to GitHub
- [ ] Vercel redeployed automatically

### Manifest Verification
- [ ] Visited `https://your-app.vercel.app/.well-known/farcaster.json`
- [ ] Manifest JSON loads correctly
- [ ] `accountAssociation` fields are populated
- [ ] Frame metadata is complete
- [ ] No JSON errors

### Preview Testing
- [ ] Tested at https://base.dev/preview
- [ ] Entered production URL
- [ ] Preview loads correctly
- [ ] Launch button works
- [ ] Account association verified
- [ ] Metadata looks good
- [ ] No errors in preview tool

---

## Smart Contract Verification

### Contract Deployment
- [ ] Contract deployed to Base Sepolia
- [ ] Deployment transaction confirmed
- [ ] Contract address copied
- [ ] Contract appears on https://sepolia.basescan.org/

### Contract Functions
- [ ] `depositBond()` works
- [ ] `getBond()` returns correct balance
- [ ] `getPotBalance()` returns correct amount
- [ ] Events are emitting properly
- [ ] Gas costs are reasonable

### Contract Testing
- [ ] Tested deposit from UI
- [ ] Verified transaction on BaseScan
- [ ] Checked contract balance increased
- [ ] User bond balance updated correctly
- [ ] Pot balance updated correctly

---

## Security Checklist

### Environment Security
- [ ] `.env` file not committed to git
- [ ] `.env.local` file not committed to git
- [ ] Private keys never exposed in code
- [ ] API keys not hardcoded anywhere
- [ ] Used test wallet for deployment (not main wallet)

### Smart Contract Security
- [ ] Contract has owner/admin controls
- [ ] ReentrancyGuard implemented
- [ ] Pausable functionality works
- [ ] No obvious vulnerabilities
- [ ] Tested on testnet first

### Production Security
- [ ] HTTPS enabled (Vercel default)
- [ ] Environment variables only in Vercel settings
- [ ] No sensitive data in public repos
- [ ] Error messages don't expose sensitive info

---

## User Experience Checklist

### First-Time User Experience
- [ ] Empty state is welcoming
- [ ] Call-to-action is clear
- [ ] Instructions are easy to follow
- [ ] Wallet connection is smooth
- [ ] First piggybank creation is intuitive

### Mobile Experience
- [ ] App is responsive on mobile
- [ ] Buttons are easily tappable
- [ ] Text is readable on small screens
- [ ] Floating action button works
- [ ] Wallet connection works on mobile

### Error Handling
- [ ] Loading states show during transactions
- [ ] Error messages are user-friendly
- [ ] Failed transactions show helpful info
- [ ] Can retry after errors
- [ ] No white screens of death

### Performance
- [ ] Page loads in < 3 seconds
- [ ] No layout shifts
- [ ] Smooth animations
- [ ] Images load quickly
- [ ] No memory leaks

---

## Publishing Checklist

### Base App Posting
- [ ] Created post in Base app
- [ ] Included app URL in post
- [ ] Rich preview appears correctly
- [ ] Launch button works from post
- [ ] Users can add app to their Base app

### Community Engagement
- [ ] Shared in Base Discord
- [ ] Posted on social media
- [ ] Prepared support channels
- [ ] Ready to respond to feedback

---

## Monitoring & Maintenance

### Post-Launch Monitoring
- [ ] Set up error tracking (optional)
- [ ] Monitor Vercel logs for errors
- [ ] Watch for failed transactions
- [ ] Check user feedback
- [ ] Monitor contract on BaseScan

### Ongoing Tasks
- [ ] Respond to user issues
- [ ] Fix bugs as they arise
- [ ] Update documentation
- [ ] Plan feature improvements
- [ ] Consider mainnet deployment

---

## Mainnet Migration Checklist

When ready to deploy to Base Mainnet with real ETH:

### Pre-Mainnet
- [ ] Thoroughly tested on Sepolia
- [ ] Fixed all known bugs
- [ ] Got user feedback
- [ ] Prepared mainnet deployment plan
- [ ] Have sufficient ETH for deployment gas

### Mainnet Deployment
- [ ] Deployed contract to Base Mainnet (`npm run deploy:mainnet`)
- [ ] Verified mainnet contract on BaseScan
- [ ] Updated `NEXT_PUBLIC_CONTRACT_ADDRESS` in Vercel
- [ ] Updated `NEXT_PUBLIC_ENVIRONMENT` to `production`
- [ ] Redeployed from Vercel
- [ ] Tested with small amounts first
- [ ] Updated account association with mainnet URL

### Post-Mainnet
- [ ] Announced mainnet launch
- [ ] Updated documentation
- [ ] Monitored for issues
- [ ] Prepared support for real money issues

---

## Emergency Procedures

If something goes wrong:

### App Not Working
1. Check Vercel logs for errors
2. Verify environment variables are set
3. Check contract is deployed
4. Verify network (Sepolia vs Mainnet)
5. Test wallet connection separately

### Contract Issues
1. Check contract on BaseScan
2. Verify contract address is correct
3. Check you have ETH for gas
4. Ensure contract is not paused
5. Contact contract owner if needed

### User Can't Connect Wallet
1. Verify OnchainKit API key is valid
2. Check browser console for errors
3. Try incognito mode
4. Test with different wallet
5. Check Coinbase Smart Wallet status

---

## Support Resources

- **OnchainKit**: https://onchainkit.xyz/
- **Base Docs**: https://docs.base.org/
- **Base Discord**: https://discord.gg/buildonbase
- **Vercel Support**: https://vercel.com/support
- **Your Repo Issues**: Create GitHub issue for bugs

---

## Final Pre-Launch Check

Right before announcing your app:

- [ ] Everything in checklist completed
- [ ] Tested end-to-end user flow
- [ ] No critical bugs remaining
- [ ] Support channels ready
- [ ] Documentation complete
- [ ] Excited to launch! 🚀

---

**When all boxes are checked, you're ready to go live!**

Good luck with your launch! 🎉

