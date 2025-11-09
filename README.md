# Django + React Full-Stack Application

A modern full-stack web application with Django REST Framework backend and React frontend.

## Quick Start

**For detailed setup instructions, see [SETUP.md](SETUP.md)**

### Prerequisites

- **Python 3.8+** (Python 3.10+ recommended)
- **Node.js 20+** (see `.nvmrc` for exact version)
- **npm** or **yarn**

### Quick Setup

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd UTDHack2025
   ```

2. **Backend Setup:**
   ```bash
   # Create and activate virtual environment
   python -m venv venv
   # Windows: venv\Scripts\activate
   # macOS/Linux: source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Create .env file (see SETUP.md for details)
   # Run migrations
   python manage.py migrate
   
   # Start server
   python manage.py runserver
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Project Structure

```
.
├── backend/          # Django backend project
│   ├── settings.py   # Django settings with CORS configuration
│   └── urls.py       # Main URL configuration
├── api/              # Django API app
│   ├── views.py      # API views
│   └── urls.py       # API URL routing
├── frontend/         # React frontend (Vite)
│   ├── src/          # React source files
│   └── package.json  # Frontend dependencies
├── requirements.txt  # Python dependencies
├── .nvmrc           # Node.js version specification
├── SETUP.md         # Detailed setup instructions
└── manage.py        # Django management script
```

## Important Notes

### Environment Variables

**You must create a `.env` file in the root directory before running the backend:**

```bash
# Copy the example file
copy env.example .env  # Windows
cp env.example .env    # macOS/Linux
```

Then edit `.env` and set your `DJANGO_SECRET_KEY`. See [SETUP.md](SETUP.md) for detailed instructions.

### Common Issues

- **`npm run dev` not working?** Make sure you're in the `frontend` directory and have run `npm install`
- **Missing dependencies?** Always run `npm install` after pulling changes
- **CORS errors?** Check that both servers are running and ports match
- **Database errors?** Run `python manage.py migrate`

For more troubleshooting, see [SETUP.md](SETUP.md#common-issues-and-solutions).

## API Endpoints

- `GET /api/hello/` - Returns a welcome message from Django

## Configuration

### CORS Settings

The Django backend is configured to allow requests from the React frontend on common development ports (5173-5175) and any localhost port when `DEBUG=True`. CORS settings are automatically configured in `backend/settings.py` based on environment variables.

### API Proxy

The Vite development server is configured to proxy API requests to Django. This is configured in `frontend/vite.config.js`.

## Development

### Running Both Servers

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

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
Deploy using your preferred method (Docker, Heroku, AWS, etc.)

## Technologies Used

### Backend
- Django 5.2.8
- Django REST Framework
- django-cors-headers

### Frontend
- React 19.1.1
- Vite 7.1.7

## Next Steps

1. Add authentication (JWT tokens, Django REST Framework SimpleJWT)
2. Create more API endpoints
3. Add database models
4. Implement CRUD operations
5. Add form validation
6. Deploy to production

## License

MIT

