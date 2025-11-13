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



For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using React, TypeScript, and Express**
