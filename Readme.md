# Sentence Completion Project

This project contains a backend FastAPI application serving an LSTM neural network model for sentence completion, and a React frontend for the user interface.

## Setting up Environment Variables

For deployment or custom configurations, you can use `.env` files.

### Frontend
To configure the frontend to talk to your deployed backend, create a `.env` file in the `frontend` directory:

```env
# frontend/.env
VITE_API_URL=https://your-deployed-backend-url.com
```

If `VITE_API_URL` is not provided, the frontend will default to `http://localhost:8000`.

### Backend
To configure CORS origins for the backend, create a `.env` file in the `backend` directory (or set the environment variable in your deployment environment like Render):

```env
# backend/.env (or set as environment variable in deployment)
ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:5173
```

If `ALLOWED_ORIGINS` is not set, the backend defaults to allowing all origins (`*`).

## Getting Started Locally

### Backend
1. Navigate to `backend/`
2. Install dependencies: `pip install -r requirements.txt`
3. Run the server: `uvicorn main:app --host 0.0.0.0 --port 8000`

### Frontend
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
