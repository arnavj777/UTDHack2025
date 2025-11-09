# Vercel 404 Error - Fix Guide

## What I've Done

1. ✅ Created `vercel.json` in the **project root** with proper build configuration
2. ✅ Updated `frontend/vite.config.ts` to ensure correct asset paths
3. ✅ Verified `frontend/vercel.json` has SPA routing rules

## Next Steps in Vercel Dashboard

### Option A: If Root Directory is NOT Set (Recommended)

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **General**
2. **Leave Root Directory EMPTY** (or set to `.`)
3. The root `vercel.json` will handle everything
4. **Save** and **Redeploy**

### Option B: If Root Directory is Set to `frontend`

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **General**
2. **Set Root Directory to: `frontend`**
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`
6. **Save** and **Redeploy**

## Verify Configuration

After redeploying, check:

1. **Build Logs**: Should show successful build
2. **Output**: Should show `dist` folder created
3. **Deployment**: Should show your app, not 404

## If Still Getting 404

1. **Check Build Logs**:
   - Look for "Build Output" section
   - Verify `dist` folder is listed
   - Check for any errors

2. **Verify Files**:
   - `index.html` should exist in build output
   - `assets/` folder should exist with JS/CSS files

3. **Check Rewrite Rules**:
   - The `vercel.json` should have the rewrite rule for SPA routing
   - All routes should redirect to `/index.html`

## Test Locally First

Before deploying, test the build locally:

```bash
cd frontend
npm run build
```

Then check that `frontend/dist/index.html` exists and has correct asset paths.

## Common Issues

### Issue: "Build Output not found"
- **Solution**: Make sure `outputDirectory` in `vercel.json` matches where Vite outputs (`dist`)

### Issue: "Assets not loading"
- **Solution**: Check that `base: '/'` is set in `vite.config.ts`

### Issue: "Routes return 404"
- **Solution**: Verify rewrite rules in `vercel.json` redirect all routes to `index.html`

