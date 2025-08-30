import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createResume,
  getUserResumes,
  getUserById,
  updateResume,
  deletedResume,
} from '../controllers/resumeController.js';

import { uploadResumeImages } from '../controllers/uploadImages.js';

const resumeRouter = express.Router();
resumeRouter.post('/', protect, createResume);
resumeRouter.get('/', protect, getUserResumes);
resumeRouter.get('/:id', protect, getUserById);

resumeRouter.put('/:id', protect, updateResume);
resumeRouter.put('/:id/upload-images', protect, uploadResumeImages);

resumeRouter.delete('/:id', protect, deletedResume);

export default resumeRouter;
