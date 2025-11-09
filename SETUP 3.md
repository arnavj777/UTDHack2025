# Setup Guide

This guide will help you set up the project on your local machine.

## Prerequisites

- **Python 3.8+** (Python 3.10+ recommended)
- **Node.js 20+** (Check `.nvmrc` file for exact version)
- **npm** or **yarn** (comes with Node.js)
- **Git**

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd UTDHack2025
```

### 2. Backend Setup (Django)

#### Step 1: Create and Activate Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### Step 2: Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory (same level as `manage.py`):

**Option 1: Copy from example (recommended):**
```bash
# Windows
copy env.example .env

# macOS/Linux
cp env.example .env
```

**Option 2: Create manually** with the following content:

```env
DJANGO_SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

**Important:** Generate a new secret key for production. You can use:
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

#### Step 4: Run Database Migrations

```bash
python manage.py migrate
```

#### Step 5: Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

#### Step 6: Start Django Server

```bash
python manage.py runserver
```

The backend will be available at `http://127.0.0.1:8000`

### 3. Frontend Setup (React)

#### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

#### Step 2: Install Node.js Version (if using nvm)

```bash
# If you have nvm installed
nvm use
# or
nvm install 20
nvm use 20
```

#### Step 3: Install Dependencies

```bash
npm install
```

**Note:** If you encounter errors, try:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json, then reinstall
rm -rf node_modules package-lock.json  # macOS/Linux
# or
rmdir /s node_modules & del package-lock.json  # Windows
npm install
```

#### Step 4: Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the next available port)

## Common Issues and Solutions

### Issue 1: `npm run dev` not working

**Problem:** Missing dependencies or incorrect command.

**Solution:**
1. Make sure you're in the `frontend` directory
2. Run `npm install` to install dependencies
3. Use `npm run dev` (with a space, not `npm rundev`)

### Issue 2: Port already in use

**Problem:** Another process is using the port.

**Solution:**
- Frontend: Vite will automatically try the next available port (5174, 5175, etc.)
- Backend: Change the port: `python manage.py runserver 8001`

### Issue 3: CORS errors

**Problem:** Frontend can't connect to backend due to CORS restrictions.

**Solution:**
- Make sure both servers are running
- Check that the frontend URL matches the CORS settings in `backend/settings.py`
- The settings are configured to allow localhost on common ports (5173-5175)

### Issue 4: Missing dependencies after pulling

**Problem:** `node_modules` is not committed to git (as it shouldn't be).

**Solution:**
1. Always run `npm install` after pulling changes
2. If issues persist, delete `node_modules` and `package-lock.json`, then run `npm install` again

### Issue 5: Python virtual environment not activating

**Problem:** Virtual environment path issues.

**Solution:**
- **Windows:** Make sure you're using `venv\Scripts\activate` (backslash)
- **macOS/Linux:** Make sure you're using `source venv/bin/activate`
- Make sure the virtual environment was created successfully

### Issue 6: Database errors

**Problem:** Database file missing or migrations not run.

**Solution:**
```bash
python manage.py migrate
```

### Issue 7: Module not found errors (Python)

**Problem:** Dependencies not installed or virtual environment not activated.

**Solution:**
1. Make sure virtual environment is activated (you should see `(venv)` in your prompt)
2. Run `pip install -r requirements.txt`
3. Make sure you're in the project root directory

### Issue 8: Node version mismatch

**Problem:** Using a different Node.js version than required.

**Solution:**
1. Check `.nvmrc` for the required version
2. Install and use the correct version:
   ```bash
   nvm install 20
   nvm use 20
   ```

## Running Both Servers

You need to run both servers simultaneously:

1. **Terminal 1 - Django Backend:**
   ```bash
   python manage.py runserver
   ```

2. **Terminal 2 - React Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## Platform-Specific Notes

### Windows
- Use backslashes (`\`) for paths in commands
- Use `;` instead of `&&` to chain commands in PowerShell
- Virtual environment activation: `venv\Scripts\activate`

### macOS/Linux
- Use forward slashes (`/`) for paths
- Use `&&` to chain commands
- Virtual environment activation: `source venv/bin/activate`

## Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Getting Help

If you encounter issues not covered here:
1. Check the error message carefully
2. Search for the error online
3. Check that all prerequisites are installed
4. Make sure you've followed all setup steps
5. Ask for help in the team chat or repository issues

