# Installation Instructions

## Fix react-router-dom Installation Issue

The `react-router-dom` package needs to be installed. Please run these commands in your terminal:

### Step 1: Navigate to frontend directory
```bash
cd frontend
```

### Step 2: Clean install dependencies
```bash
npm install
```

### Step 3: If react-router-dom still isn't installed, install it explicitly
```bash
npm install react-router-dom@6.28.0 --save
```

### Step 4: Verify installation
```bash
npm list react-router-dom
```

### Step 5: Start the dev server
```bash
npm run dev
```

## Alternative: Full Clean Install

If the above doesn't work, try a complete clean install:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

On Windows PowerShell:
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install
npm run dev
```

## Expected Result

After installation, the dev server should start on `http://localhost:5173` and you should see the landing page.

## Troubleshooting

If you still get errors:
1. Make sure Node.js and npm are installed: `node --version` and `npm --version`
2. Try updating npm: `npm install -g npm@latest`
3. Clear npm cache: `npm cache clean --force`
4. Check for conflicting versions in package.json

