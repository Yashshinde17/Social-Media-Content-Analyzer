# 📊 Social Media Content Analyzer

A full-stack application that analyzes social media posts by extracting text from PDF documents and images using OCR technology. Built with React, TypeScript, Express, and Tesseract.js.

## ✨ Features

- **📤 Document Upload**: Drag-and-drop or file picker interface for uploading PDFs and images
- **📄 PDF Text Extraction**: Parse PDF files and extract text while maintaining formatting
- **🔍 OCR Processing**: Extract text from scanned documents and images using Tesseract.js
- **⚡ Real-time Processing**: Automatic processing with live status updates
- **📊 Progress Tracking**: Visual progress bars and status indicators
- **🎨 Modern UI**: Clean, responsive interface with loading states
- **⚠️ Error Handling**: Comprehensive validation and error messages

## 🏗️ Architecture

### Backend (Node.js + Express + TypeScript)
- **File Upload**: Multer middleware for handling multipart/form-data
- **PDF Processing**: pdf-parse library for PDF text extraction
- **OCR Engine**: Tesseract.js for image-to-text conversion
- **Job Orchestration**: Async processing with in-memory job store
- **RESTful API**: Clean API design with proper error handling

### Frontend (React + TypeScript + Vite)
- **File Upload Component**: Drag-and-drop with file validation
- **Job Polling**: Real-time status updates via polling
- **State Management**: React hooks for clean state handling
- **Responsive Design**: Mobile-friendly CSS layout

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v10.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Social Media Content Analyzer"
   ```

2. **Install Backend dependencies**
   ```powershell
   cd Backend
   npm install
   ```

3. **Install Frontend dependencies**
   ```powershell
   cd ../Frontend
   npm install
   ```

### Running the Application

#### Start the Backend Server

```powershell
cd Backend
npm run dev
```

The backend server will start on **http://localhost:3001**

#### Start the Frontend Development Server

```powershell
cd Frontend
npm run dev
```

The frontend will start on **http://localhost:3000**

### Environment Variables

#### Backend (.env)
```env
PORT=3001
UPLOAD_DIR=./uploads
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 📡 API Documentation

### Upload Endpoints

#### POST /api/upload
Upload a PDF or image file for processing.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (File)

**Response:**
```json
{
  "success": true,
  "file": {
    "id": "uuid",
    "originalName": "document.pdf",
    "filename": "uuid.pdf",
    "path": "/uploads/uuid.pdf",
    "size": 102400,
    "mimetype": "application/pdf",
    "fileType": "pdf",
    "uploadedAt": "2025-11-13T10:00:00.000Z"
  },
  "jobId": "job-uuid",
  "message": "File uploaded successfully and processing started"
}
```

### Processing Endpoints

#### POST /api/process/pdf
Extract text from a PDF file.

**Request:**
```json
{
  "filePath": "/path/to/file.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Extracted text content...",
    "metadata": {
      "pages": 5,
      "info": {}
    }
  }
}
```

#### POST /api/process/ocr
Extract text from an image using OCR.

**Request:**
```json
{
  "filePath": "/path/to/image.jpg",
  "language": "eng"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Extracted text...",
    "confidence": 89.5,
    "metadata": {
      "language": "eng",
      "blocks": 12
    }
  }
}
```

#### POST /api/process/extract
Auto-detect file type and extract text.

**Request:**
```json
{
  "filePath": "/path/to/file",
  "fileType": "pdf"
}
```

### Job Status Endpoints

#### GET /api/jobs/:jobId
Get the status and result of a processing job.

**Response:**
```json
{
  "success": true,
  "job": {
    "id": "job-uuid",
    "fileId": "file-uuid",
    "status": "completed",
    "type": "pdf",
    "result": {
      "text": "Extracted text...",
      "metadata": {}
    },
    "createdAt": "2025-11-13T10:00:00.000Z",
    "updatedAt": "2025-11-13T10:00:05.000Z"
  }
}
```

#### GET /api/jobs
Get all jobs (for debugging).

### Health Check

#### GET /api/health
Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Social Media Content Analyzer API is running",
  "timestamp": "2025-11-13T10:00:00.000Z"
}
```

## 📁 Project Structure

```
Social Media Content Analyzer/
├── Backend/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── middleware/       # Express middleware (upload, etc.)
│   │   ├── routes/           # API routes
│   │   │   ├── upload.routes.ts
│   │   │   ├── process.routes.ts
│   │   │   └── jobs.routes.ts
│   │   ├── services/         # Business logic
│   │   │   ├── pdf.service.ts
│   │   │   ├── ocr.service.ts
│   │   │   ├── job.store.ts
│   │   │   └── orchestrator.service.ts
│   │   ├── types/            # TypeScript types
│   │   └── index.ts          # Entry point
│   ├── uploads/              # Uploaded files directory
│   ├── package.json
│   └── tsconfig.json
│
└── Frontend/
    ├── src/
    │   ├── components/       # React components
    │   │   ├── FileUpload.tsx
    │   │   └── FileUpload.css
    │   ├── services/         # API services
    │   │   └── upload.service.ts
    │   ├── types/            # TypeScript types
    │   ├── App.tsx
    │   ├── App.css
    │   └── main.tsx
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

## 🛠️ Technologies Used

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Multer** - File upload handling
- **pdf-parse** (v1.1.1) - PDF text extraction
- **Tesseract.js** - OCR engine
- **uuid** - Unique ID generation
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Styling

## 🎯 Supported File Types

### Documents
- **PDF** (.pdf)

### Images
- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **TIFF** (.tiff)
- **BMP** (.bmp)

**Maximum file size**: 10MB

## 🔄 Workflow

1. **Upload**: User uploads a PDF or image file
2. **Validation**: File type and size are validated
3. **Storage**: File is saved to the uploads directory
4. **Job Creation**: A processing job is created and stored
5. **Processing**: 
   - PDFs are processed with pdf-parse
   - Images are processed with Tesseract.js OCR
6. **Status Updates**: Frontend polls for job status every 2 seconds
7. **Results Display**: Extracted text is displayed once processing is complete

## 🧪 Testing

### Testing File Upload
```bash
# Using curl (PowerShell)
curl -X POST http://localhost:3001/api/upload -F "file=@path/to/document.pdf"
```

### Testing PDF Processing
```bash
# Using Invoke-WebRequest (PowerShell)
$body = @{
    filePath = "D:/path/to/file.pdf"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3001/api/process/pdf `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

## 🚧 Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and authorization
- [ ] File history and management
- [ ] Batch processing
- [ ] Additional OCR languages
- [ ] Export extracted text (TXT, JSON, CSV)
- [ ] Advanced text analysis and NLP
- [ ] Cloud storage integration (S3, Azure Blob)
- [ ] Docker containerization
- [ ] Unit and integration tests
- [ ] CI/CD pipeline

## 📝 Development Notes

### Key Design Decisions

1. **In-Memory Job Store**: Currently using an in-memory Map for job storage. In production, this should be replaced with a database (Redis, PostgreSQL, etc.)

2. **Polling vs WebSockets**: Using HTTP polling for simplicity. For production, consider WebSockets for real-time updates.

3. **pdf-parse Version**: Using v1.1.1 due to compatibility issues with newer versions on Node.js 18.

4. **File Storage**: Files are stored locally in the `uploads/` directory. For production, use cloud storage.

5. **Error Handling**: Basic error handling is implemented. Production apps should have more comprehensive error tracking (Sentry, etc.)

## 📄 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using React, TypeScript, and Express**
