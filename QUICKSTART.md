# 🚀 Quick Start Guide

## Start Both Servers (Recommended)

### Option 1: Using Two Terminals

**Terminal 1 - Backend:**
```powershell
cd "d:\Social Media Content Analyzer\Backend"
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd "d:\Social Media Content Analyzer\Frontend"
npm run dev
```

### Option 2: Using VS Code Tasks

1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select "Start Backend and Frontend"

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

## Test the Application

1. Open http://localhost:3000 in your browser
2. Drag and drop a PDF file or image
3. Watch the progress bar during upload
4. See the processing status update automatically
5. View the extracted text once processing is complete!

## Sample Test Files

You can test with:
- Any PDF document
- Screenshots (PNG, JPEG)
- Scanned documents (TIFF, BMP)
- Photos with text

## Troubleshooting

### Port Already in Use

If port 3001 or 3000 is already in use:

```powershell
# Kill process on port 3001
$proc = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
Stop-Process -Id $proc -Force

# Kill process on port 3000
$proc = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
Stop-Process -Id $proc -Force
```

### Module Not Found

```powershell
# Reinstall dependencies
cd Backend
npm install

cd ../Frontend
npm install
```

### CORS Errors

Make sure the backend is running on port 3001 and the frontend is configured to use `http://localhost:3001/api`.

## API Testing with curl

```powershell
# Upload a file
curl -X POST http://localhost:3001/api/upload `
  -F "file=@path\to\your\file.pdf"

# Check job status (replace JOB_ID)
curl http://localhost:3001/api/jobs/JOB_ID

# Health check
curl http://localhost:3001/api/health
```

## Development Commands

### Backend

```powershell
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linter
npm run format   # Format code
```

### Frontend

```powershell
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
npm run format   # Format code
```

## Next Steps

See the main [README.md](./README.md) for complete documentation.
