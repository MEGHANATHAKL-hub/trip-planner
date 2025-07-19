# Environment Setup Guide

## Local Development Setup

### Client (Frontend)
1. The client uses Vite which automatically loads environment files based on the mode:
   - `.env` - Loaded in all cases
   - `.env.local` - Loaded in all cases, ignored by git
   - `.env.production` - Only loaded in production mode

2. For local development, create `.env.local` (already created):
   ```
   VITE_API_URL=http://localhost:5000
   ```

### Server (Backend)
1. The server `.env` file is already configured for local development:
   - `NODE_ENV=development`
   - `PORT=5000`
   - `CLIENT_URL=http://localhost:5173`

## Production Deployment

### Client Production
1. For production builds, Vite will automatically use `.env.production`:
   ```
   VITE_API_URL=https://trip-planner-xihe.onrender.com
   ```

2. Build command: `npm run build`

### Server Production
1. Set these environment variables in your production environment (e.g., Render):
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-netlify-app.netlify.app`
   - `MONGODB_URI=your_production_mongodb_uri`
   - `JWT_SECRET=your_production_jwt_secret`

## Running the Application

### Local Development
```bash
# Option 1: Using the startup script
./start.sh

# Option 2: Using npm from root directory
npm run dev

# Option 3: Running separately
# Terminal 1 - Server
cd server && npm run dev

# Terminal 2 - Client
cd client && npm run dev
```

### Environment Priority
- Client: Vite automatically uses the appropriate .env file based on the mode
- Server: Uses .env file with NODE_ENV to determine behavior

## CORS Configuration
The server automatically configures CORS based on NODE_ENV:
- Development: Allows localhost:3000, localhost:5173, localhost:5174
- Production: Uses CLIENT_URL from environment variables

## Notes
- `.env.local` files are ignored by git (included in .gitignore)
- Never commit sensitive data like JWT_SECRET or MONGODB_URI
- Always use environment variables for production deployments