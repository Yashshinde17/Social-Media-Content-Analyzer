import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

// Allowed file types
const ALLOWED_MIME_TYPES = {
  pdf: ['application/pdf'],
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/bmp'],
};

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    const filename = `${uniqueId}${ext}`;
    cb(null, filename);
  },
});

// File filter for validation
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allAllowedTypes = [
    ...ALLOWED_MIME_TYPES.pdf,
    ...ALLOWED_MIME_TYPES.image,
  ];

  if (allAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed types: PDF, JPEG, PNG, TIFF, BMP. Received: ${file.mimetype}`
      )
    );
  }
};

// Create multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Helper function to determine file type
export const getFileType = (
  mimetype: string
): 'pdf' | 'image' | 'unknown' => {
  if (ALLOWED_MIME_TYPES.pdf.includes(mimetype)) {
    return 'pdf';
  }
  if (ALLOWED_MIME_TYPES.image.includes(mimetype)) {
    return 'image';
  }
  return 'unknown';
};

export { ALLOWED_MIME_TYPES, MAX_FILE_SIZE };
