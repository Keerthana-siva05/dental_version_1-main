import express from 'express';
import multer from 'multer';
import Resource from '../models/resourceModel.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    const uploadDir = 'uploads/resources/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'video/mp4',
    'video/webm',
    'video/ogg'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDFs, documents, and videos are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Upload a new resource
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, description, fileType, courseType } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newResource = new Resource({
      title,
      description,
      fileType,
      courseType,
      filePath: req.file.path,
      originalFileName: req.file.originalname
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error uploading resource:', error);
    res.status(500).json({ message: 'Error uploading resource', error: error.message });
  }
});

// Get all resources with optional course type filtering
router.get('/', async (req, res) => {
  try {
    const { courseType } = req.query;
    let query = {};
    
    if (courseType) {
      query.courseType = courseType;
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resources', error: error.message });
  }
});

// Delete a resource
router.delete('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Delete the file from the filesystem
    fs.unlink(resource.filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resource', error: error.message });
  }
});

export default router;