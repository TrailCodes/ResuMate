import fs from 'fs';
import path from 'path';

import Resume from '../models/resumeModel.js';
import upload from '../middlewares/uploadMiddleware.js';

export const uploadResumeImages = async (req, res) => {
  // Use multer middleware to handle file uploads
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        message: 'File upload Failed',
        error: err.message,
      });
    }

    try {
      const resumeId = req.params.id;
      const resume = await Resume.findOne({
        _id: resumeId,
        userId: req.user._id,
      });

      if (!resume) {
        return res.status(404).json({ message: 'Resume not Found' });
      }

      // Use process.cwd() to locate upload folder
      const uploadFolder = path.join(process.cwd(), 'uploads');
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      const newThumbnail = req.files?.thumbnail?.[0];
      const newProfileImage = req.files?.profileImage?.[0];

      // Handle thumbnail upload
      if (newThumbnail) {
        // Delete old thumbnail if it exists
        if (resume.thumbnailLink) {
          const oldThumbnail = path.join(
            uploadFolder,
            path.basename(resume.thumbnailLink)
          );

          if (fs.existsSync(oldThumbnail)) {
            fs.unlinkSync(oldThumbnail);
          }
        }
        // Fix typo: "uplaod" should be "upload"
        resume.thumbnailLink = `${baseUrl}/upload/${newThumbnail.filename}`;
      }

      // Handle profile image upload
      if (newProfileImage) {
        // Delete old profile image if it exists
        if (resume.profileInfo.profilePreviewUrl) {
          const oldProfileImage = path.join(
            uploadFolder,
            path.basename(resume.profileInfo.profilePreviewUrl)
          );

          if (fs.existsSync(oldProfileImage)) {
            fs.unlinkSync(oldProfileImage);
          }
        }
        // Fix typo: "uplaod" should be "upload"
        resume.profileInfo.profilePreviewUrl = `${baseUrl}/upload/${newProfileImage.filename}`;
      }

      // Save the updated resume
      await resume.save();

      return res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        resume: {
          id: resume._id,
          thumbnailLink: resume.thumbnailLink,
          profileImageLink: resume.profileInfo.profilePreviewUrl,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error during file processing',
        error: error.message,
      });
    }
  });
};
