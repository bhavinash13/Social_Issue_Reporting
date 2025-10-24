import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { auth, adminAuth } from '../middleware/auth.js';
import {
  createReport,
  getAllReports,
  getReportById,
  getMyReports,
  updateReportStatus,
  deleteReport,
  getComments,
  addComment,
  addReply,
  updateComment,
  deleteComment
} from '../controllers/reportController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.post('/', auth, upload.array('images', 5), createReport);
router.get('/', getAllReports);
router.get('/my', auth, getMyReports);
router.get('/:id', getReportById);
router.patch('/:id/status', adminAuth, updateReportStatus);
router.delete('/:id', adminAuth, deleteReport);

// Comment routes
router.get('/:id/comments', getComments);
router.post('/:id/comments', auth, addComment);
router.post('/comments/:commentId/reply', auth, addReply);
router.patch('/comments/:commentId', auth, updateComment);
router.delete('/comments/:commentId', auth, deleteComment);



export default router;