# Piggyfi Base Mini App Deployment Guide

This guide will walk you through deploying your Piggyfi mini app to Base.

## Prerequisites

Before you begin, make sure you have:

- ✅ A [Base app account](https://base.org/)
- ✅ A [Vercel account](https://vercel.com/) (for hosting)
- ✅ A GitHub account
- ✅ Your project pushed to GitHub

---

## Step 1: Prepare Your Images

You need three images for your mini app. Replace the placeholder files in the `public/` directory:

### Required Images:

1. **App Icon** (`public/blue-icon.png`)
   - Size: 512x512px
   - Format: PNG
   - Description: Your app's icon that appears in the Base app

2. **Hero/Splash Image** (`public/blue-hero.png`)
   - Size: 1200x630px
   - Format: PNG
   - Description: The splash screen and hero image for your app

3. **Screenshot** (`public/screenshot-portrait.png`)
   - Size: 750x1624px
   - Format: PNG
   - Description: A portrait screenshot showing your app's main interface

> **💡 Tip:** Use tools like Figma, Canva, or Photoshop to create these images. Make sure they look professional and represent your brand well.

---

## Step 2: Push Your Code to GitHub

If you haven't already, initialize and push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Prepare for Base mini app deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Important: Turn Off Deployment Protection

After deployment:
1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Deployment Protection**
3. Toggle **"Vercel Authentication"** to **OFF**
4. Click **Save**

> ⚠️ **This is critical!** The Base app needs to access your manifest file without authentication.

---

## Step 4: Note Your Deployment URL

After deployment, Vercel will provide you with a URL like:
```
https://your-app-name.vercel.app
```

**Copy this URL** - you'll need it in the next step.

---

## Step 5: Create Account Association Credentials

Now you'll associate your mini app with your Farcaster account:

1. Go to the [Base Build Account Association Tool](https://build.base.org/account-association)

2. In the **App URL** field, paste your Vercel URL (without `https://`):
   ```
   your-app-name.vercel.app
   ```

3. Click **"Submit"**

4. Click the **"Verify"** button that appears

5. Follow the instructions to sign with your Farcaster account

6. After signing, you'll receive an `accountAssociation` object that looks like:
   ```json
   {
     "header": "eyJmaWQ...",
     "payload": "eyJkb21...",
     "signature": "MHhmNGQ..."
   }
   ```

7. **Copy the entire `accountAssociation` object**

---

## Step 6: Update minikit.config.ts

1. Open `minikit.config.ts` in your code editor

2. Replace the empty `accountAssociation` object with the one you copied:

```typescript
export const minikitConfig = {
  accountAssociation: {
    "header": "eyJmaWQiOjE3MzE4LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4NzYwQjA0NDc5NjM4MTExNzNmRjg3YDPBYzA5OEJBQ0YxNzNCYkU0OCJ9",
    "payload": "eyJkb21haW4iOiJ4BWl0bGlzdC1xcy52ZXJjZWwuYXBwIn7",
    "signature": "MHhmNGQzN2M2OTk4NDIwZDNjZWVjYTNiODllYzJkMjAwOTkyMDEwOGVhNTFlYWI3NjAyN2QyMmM1MDVhNzIyMWY2NTRiYmRlZmQ0NGQwOWNiY2M2NmI2B7VmNGZiMmZiOGYzNDVjODVmNmQ3ZTVjNzI3OWNmMGY4ZTA2ODYzM2FjZjFi"
  },
  miniapp: {
    // ... rest of your config
  },
}
```

3. Save the file

---

## Step 7: Push Updates and Redeploy

```bash
# Add your changes
git add minikit.config.ts

# Commit
git commit -m "Add account association credentials"

# Push to GitHub
git push
```

Vercel will automatically redeploy your app with the new configuration.

---

## Step 8: Preview Your App

Go to [base.dev/preview](https://base.dev/preview) to validate your app:

1. Enter your app URL in the preview tool
2. Check the following tabs:
   - **Preview:** See how your app appears in embeds
   - **Account Association:** Verify credentials are correct
   - **Metadata:** Review all manifest fields

3. Click the **Launch** button to test your app

---

## Step 9: Publish Your App

To make your app available in the Base app:

1. Open the [Base app](https://base.org/)
2. Create a new post (cast)
3. Include your app's URL in the post:
   ```
   Check out Piggyfi! 🐷💰
   https://your-app-name.vercel.app
   ```
4. Post it!

The Base app will automatically detect your mini app and create a rich preview. Users can add your app to their Base app from this post.

---

## Step 10: Monitor Your Webhook

Your app is now configured to receive webhook events at `/api/webhook`. You can monitor these events in:

- **Vercel Logs:** Go to your project → "Logs" tab
- **Production Logs:** View real-time webhook activity

### Webhook Events You'll Receive:

- `frame_added` - User adds your mini app
- `frame_removed` - User removes your mini app
- `notifications_enabled` - User enables notifications
- `notifications_disabled` - User disables notifications

---

## Troubleshooting

### App doesn't load in Base app

1. Check Vercel deployment status
2. Verify Deployment Protection is OFF
3. Check manifest at: `https://your-app-name.vercel.app/.well-known/farcaster.json`
4. Verify account association at [base.dev/preview](https://base.dev/preview)

### Images not showing

1. Ensure images are in the `public/` directory
2. Check image file names match those in `minikit.config.ts`
3. Verify images are accessible at: `https://your-app-name.vercel.app/blue-icon.png`

### Account Association fails

1. Make sure you're using the correct Vercel URL
2. Don't include `https://` in the account association tool
3. Ensure your app is deployed and accessible
4. Try the association process again

### Manifest not found (404)

1. Check that `app/.well-known/farcaster.json/route.ts` exists
2. Verify `vercel.json` is in the root directory
3. Redeploy your app after making changes

---

## Next Steps

After deployment, consider:

1. **Add Analytics:** Track user engagement and app usage
2. **Implement Notifications:** Send push notifications to users (see [Base docs](https://docs.base.org/mini-apps/core-concepts/notifications))
3. **Improve UI/UX:** Based on user feedback
4. **Add More Features:** Expand your piggy bank functionality
5. **Engage Community:** Share updates in Base app

---

## Additional Resources

- [Base Mini Apps Documentation](https://docs.base.org/mini-apps/)
- [Base Build Platform](https://build.base.org/)
- [Farcaster Protocol](https://docs.farcaster.xyz/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

## Support

If you encounter issues:

1. Check [Base Mini Apps Troubleshooting](https://docs.base.org/mini-apps/troubleshooting/)
2. Ask in the [Base Discord](https://discord.gg/buildonbase)
3. Review the [Common Issues Guide](https://docs.base.org/mini-apps/troubleshooting/common-issues)

---

## Quick Checklist

Before publishing, ensure:

- [ ] All three images are in place and properly sized
- [ ] Code is pushed to GitHub
- [ ] App is deployed to Vercel
- [ ] Deployment Protection is OFF
- [ ] Account association is completed
- [ ] `minikit.config.ts` is updated with credentials
- [ ] App tested at base.dev/preview
- [ ] Manifest is accessible at `/.well-known/farcaster.json`
- [ ] Webhook endpoint is working

---

**Good luck with your Base mini app launch! 🚀**

