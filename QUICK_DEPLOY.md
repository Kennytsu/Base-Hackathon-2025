# Quick Deploy Reference - Piggyfi Base Mini App

## 🚀 Fast Track Deployment (10 minutes)

### 1️⃣ Prepare Images (2 min)
Replace these files in `public/`:
- `blue-icon.png` (512x512px) - Your app icon
- `blue-hero.png` (1200x630px) - Splash/hero image
- `screenshot-portrait.png` (750x1624px) - App screenshot

### 2️⃣ Push to GitHub (1 min)
```bash
git add .
git commit -m "Ready for deployment"
git push
```

### 3️⃣ Deploy to Vercel (2 min)
- Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- Click "Add New" → "Project"
- Import your GitHub repo
- Click "Deploy"
- **IMPORTANT:** Turn OFF "Vercel Authentication" in Settings → Deployment Protection

### 4️⃣ Get Account Association (3 min)
- Copy your Vercel URL (e.g., `your-app.vercel.app`)
- Go to [build.base.org/account-association](https://build.base.org/account-association)
- Paste your URL (without `https://`)
- Click "Submit" → "Verify"
- Sign with Farcaster
- Copy the `accountAssociation` object

### 5️⃣ Update Config (1 min)
Paste the credentials into `minikit.config.ts`:
```typescript
accountAssociation: {
  "header": "eyJ...",    // Paste your values here
  "payload": "eyJ...",
  "signature": "MHh..."
}
```

### 6️⃣ Redeploy (1 min)
```bash
git add minikit.config.ts
git commit -m "Add account association"
git push
```

### 7️⃣ Test & Publish (< 1 min)
- Test at [base.dev/preview](https://base.dev/preview)
- Post your URL in Base app to publish!

---

## ✅ Files Created

Your project now includes:

| File | Purpose |
|------|---------|
| `app/.well-known/farcaster.json/route.ts` | Manifest endpoint for Base app |
| `app/api/webhook/route.ts` | Webhook handler for app events |
| `vercel.json` | Vercel deployment configuration |
| `minikit.config.ts` | Updated with better metadata |
| `public/blue-icon.png` | App icon placeholder |
| `public/blue-hero.png` | Hero image placeholder |
| `public/screenshot-portrait.png` | Screenshot placeholder |

---

## 🔗 Important URLs

- **Account Association Tool:** https://build.base.org/account-association
- **Preview Tool:** https://base.dev/preview
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Base Docs:** https://docs.base.org/mini-apps/

---

## 🐛 Common Issues

**Q: Manifest returns 404**
- Check `vercel.json` is in root directory
- Redeploy after making changes

**Q: Images not loading**
- Ensure files are PNG format and in `public/` directory
- Check file names match exactly

**Q: Account association fails**
- Remove `https://` from URL
- Ensure Deployment Protection is OFF
- App must be deployed and accessible

---

## 📍 Your App URLs

After deployment, your app will have these endpoints:

- **App:** `https://your-app.vercel.app`
- **Manifest:** `https://your-app.vercel.app/.well-known/farcaster.json`
- **Webhook:** `https://your-app.vercel.app/api/webhook`

---

## 🎯 Post-Deployment

✅ Monitor webhook events in Vercel logs
✅ Share your app in Base community
✅ Gather user feedback
✅ Iterate and improve!

---

**Need more details? Check `DEPLOYMENT_GUIDE.md`**

