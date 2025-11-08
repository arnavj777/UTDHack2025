# Django + React Full-Stack Application

A modern full-stack web application with Django REST Framework backend and React frontend.

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
└── manage.py         # Django management script
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Setup Instructions

### Backend Setup (Django)

1. **Create and activate a virtual environment (Recommended):**
   
   **Windows:**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
   
   **macOS/Linux:**
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
   
   **Note:** The virtual environment has already been created. You just need to activate it:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   
   **Note:** Make sure your virtual environment is activated (you should see `(venv)` in your terminal prompt).

3. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create a superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

5. **Start the Django development server:**
   ```bash
   python manage.py runserver
   ```
   The backend will be available at `http://127.0.0.1:8000`

### Frontend Setup (React)

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## API Endpoints

- `GET /api/hello/` - Returns a welcome message from Django

## Configuration

### CORS Settings

The Django backend is configured to allow requests from the React frontend. CORS settings are in `backend/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

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

