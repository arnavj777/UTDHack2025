# Quick Vercel Deployment Setup

## The Problem
You're getting a 404 error because Vercel doesn't know where your frontend code is located.

## Solution: Configure Vercel to Use Frontend Directory

### Option 1: Via Vercel Dashboard (Easiest)

1. **Go to your Vercel project dashboard**
2. **Click on "Settings"**
3. **Go to "General" → "Root Directory"**
4. **Set Root Directory to: `frontend`**
5. **Click "Save"**
6. **Redeploy your project**

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link your project (if not already linked)
cd frontend
vercel link

# Set root directory
vercel --prod
```

### Option 3: Manual Configuration File

If the above doesn't work, create a `vercel.json` in the **project root** (not in frontend):

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "devCommand": "cd frontend && npm run dev",
  "framework": "vite"
}
```

## Important: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
VITE_API_URL=https://your-django-backend-url.com/api
```

Replace `your-django-backend-url.com` with your actual Django backend URL (Railway, Render, etc.)

## After Configuration

1. **Redeploy** your project
2. **Check build logs** to ensure the build succeeds
3. **Verify** that the `dist` folder is created in the build output
4. **Test** your deployment URL

## Common Issues

### Issue: Still getting 404
- **Solution**: Make sure Root Directory is set to `frontend` in Vercel dashboard
- Check that `frontend/dist` exists after build
- Verify `frontend/vercel.json` exists with the rewrite rules

### Issue: Build fails
- **Solution**: Check build logs for errors
- Ensure all dependencies are in `frontend/package.json`
- Verify Node.js version compatibility

### Issue: API calls not working
- **Solution**: Set `VITE_API_URL` environment variable in Vercel
- Make sure your Django backend is deployed and accessible
- Check CORS settings in Django

## Next Steps

1. Deploy Django backend to Railway or Render (see `VERCEL_DEPLOYMENT.md`)
2. Set `VITE_API_URL` to point to your Django backend
3. Configure CORS in Django to allow your Vercel domain
4. Test the full stack

## Need Help?

Check the full deployment guide in `VERCEL_DEPLOYMENT.md` for detailed instructions.

