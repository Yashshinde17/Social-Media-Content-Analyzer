# Deployment Guide

## Important Note About File Uploads

⚠️ **Vercel has limitations for file uploads:**
- Maximum request body size: 4.5MB on Hobby plan
- Serverless functions have a 50MB deployment size limit
- File storage is ephemeral (temporary)

For production use with larger files, consider:
1. Using Vercel Blob Storage
2. Deploying backend on Railway, Render, or AWS
3. Using cloud storage (AWS S3, Cloudinary)

## Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel:** https://vercel.com/new
2. **Import your GitHub repository:** Select `Social-Media-Content-Analyzer`

#### Deploy Backend:
1. Select the `Backend` folder as the root directory
2. Framework Preset: **Other**
3. Build Command: `npm run vercel-build`
4. Output Directory: `dist`
5. Environment Variables:
   - `NODE_ENV` = `production`
6. Click **Deploy**
7. **Copy the deployed backend URL** (e.g., `https://your-backend.vercel.app`)

#### Deploy Frontend:
1. Create a new project and import the same repository
2. Select the `Frontend` folder as the root directory
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_URL` = `https://your-backend.vercel.app/api` (use your actual backend URL)
7. Click **Deploy**

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy Backend
cd Backend
vercel --prod

# Deploy Frontend
cd ../Frontend
vercel --prod
```

After deploying backend, update the frontend environment variable `VITE_API_URL` with the backend URL.

## Alternative: Better Deployment Options

### Backend on Railway (Recommended for file uploads)
1. Go to https://railway.app
2. Connect GitHub repository
3. Select Backend folder
4. Railway provides persistent storage and better file handling
5. Free tier: 500 hours/month

### Backend on Render
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Select Backend folder
5. Free tier available with persistent disk

### Frontend on Vercel + Backend on Railway
This is the **best combination** for this app:
- Frontend on Vercel (fast, free, optimized for React)
- Backend on Railway (better for file uploads, persistent storage)

## Environment Variables

### Backend (.env)
```
PORT=3001
UPLOAD_DIR=./uploads
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url/api
```

## Post-Deployment

1. Test the health endpoint: `https://your-backend.vercel.app/api/health`
2. Test file upload with a small file first
3. Monitor Vercel logs for any issues

## Troubleshooting

- **500 Error on upload**: File might be too large for Vercel (4.5MB limit)
- **Module not found**: Ensure all dependencies are in package.json
- **CORS errors**: Backend CORS is configured to allow all origins
- **OCR not working**: Tesseract.js might be too large for serverless - consider Railway

