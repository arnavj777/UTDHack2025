# Vercel Deployment Guide

This guide explains how to deploy your Django + React application to Vercel.

## Architecture

- **Frontend (React/Vite)**: Deploy to Vercel
- **Backend (Django)**: Deploy separately to Railway, Render, or another service

## Step 1: Deploy Frontend to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Connect your repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub/GitLab repository

2. **Configure Project Settings:**
   - **Root Directory**: Set to `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

3. **Environment Variables:**
   Add these in Vercel dashboard → Settings → Environment Variables:
   ```
   VITE_API_URL=https://your-django-backend-url.com/api
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set environment variables:**
   ```bash
   vercel env add VITE_API_URL
   # Enter: https://your-django-backend-url.com/api
   ```

## Step 2: Deploy Backend (Django)

### Option A: Railway (Recommended)

1. **Create Railway account:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure service:**
   - Railway will auto-detect Django
   - Set root directory to project root (not `backend/` or `frontend/`)

4. **Environment Variables:**
   Add these in Railway dashboard:
   ```
   SECRET_KEY=your-secret-key
   DEBUG=False
   ALLOWED_HOSTS=your-railway-url.railway.app,your-custom-domain.com
   CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   GEMINI_API_KEY=your-gemini-api-key
   SERPAPI_KEY=your-serpapi-key
   DATABASE_URL=postgresql://... (Railway provides this)
   ```

5. **Build Command:**
   ```
   pip install -r requirements.txt
   ```

6. **Start Command:**
   ```
   python manage.py migrate && gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT
   ```

7. **Install Gunicorn:**
   Add to `requirements.txt`:
   ```
   gunicorn>=21.2.0
   ```

### Option B: Render

1. **Create Render account:**
   - Go to [render.com](https://render.com)
   - Sign up

2. **Create new Web Service:**
   - Connect your GitHub repository
   - Set root directory to project root

3. **Configure:**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT`
   - **Environment**: Python 3

4. **Environment Variables:**
   Same as Railway configuration

## Step 3: Update CORS Settings

Update `backend/settings.py` to allow your Vercel frontend:

```python
CORS_ALLOWED_ORIGINS = [
    "https://your-vercel-app.vercel.app",
    "https://your-custom-domain.com",
]

# Or for development:
CORS_ALLOW_ALL_ORIGINS = False  # Set to False in production
```

## Step 4: Update Django ALLOWED_HOSTS

In `backend/settings.py`:

```python
ALLOWED_HOSTS = [
    'your-railway-url.railway.app',
    'your-custom-domain.com',
    'localhost',
    '127.0.0.1',
]
```

## Step 5: Database Setup

### For Production:

1. **Use PostgreSQL:**
   - Railway/Render provides PostgreSQL databases
   - Use the `DATABASE_URL` environment variable

2. **Update settings.py:**
   ```python
   import dj_database_url
   
   DATABASES = {
       'default': dj_database_url.config(
           default=os.getenv('DATABASE_URL'),
           conn_max_age=600,
       )
   }
   ```

3. **Add to requirements.txt:**
   ```
   dj-database-url>=2.0.0
   psycopg2-binary>=2.9.0
   ```

## Step 6: Static Files

For production, use a CDN or serve static files:

1. **Install WhiteNoise:**
   ```bash
   pip install whitenoise
   ```

2. **Update settings.py:**
   ```python
   MIDDLEWARE = [
       'whitenoise.middleware.WhiteNoiseMiddleware',
       # ... other middleware
   ]
   
   STATIC_URL = '/static/'
   STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
   ```

3. **Add to requirements.txt:**
   ```
   whitenoise>=6.5.0
   ```

## Troubleshooting

### 404 Error on Vercel

1. **Check Root Directory:**
   - Ensure Vercel is configured to use `frontend/` as root
   - Or use the `vercel.json` in the frontend directory

2. **Check Build Output:**
   - Verify `dist/` folder is created after build
   - Check build logs in Vercel dashboard

3. **Check Routing:**
   - Ensure `vercel.json` has the rewrite rule for SPA routing
   - All routes should redirect to `index.html`

### API Connection Issues

1. **Check Environment Variables:**
   - Verify `VITE_API_URL` is set in Vercel
   - Check that it points to your deployed Django backend

2. **Check CORS:**
   - Verify CORS settings in Django allow your Vercel domain
   - Check browser console for CORS errors

3. **Check Backend URL:**
   - Ensure Django backend is accessible
   - Test API endpoints directly in browser/Postman

### Build Failures

1. **Check Dependencies:**
   - Ensure all dependencies are in `package.json`
   - Check for version conflicts

2. **Check Node Version:**
   - Vercel auto-detects Node version
   - You can specify in `package.json`:
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

## Quick Deploy Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] Environment variables set in both services
- [ ] CORS configured in Django
- [ ] ALLOWED_HOSTS updated
- [ ] Database configured and migrated
- [ ] Static files configured
- [ ] API URL environment variable set in Vercel
- [ ] Test API connection from frontend

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Django backend logs
3. Check browser console for errors
4. Verify all environment variables are set
5. Test API endpoints directly

