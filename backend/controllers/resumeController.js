import Resume from '../models/resumeModel.js';
import fs from 'fs';
import path from 'path';

export const createResume = async (req, res) => {
  try {
    const { title } = req.body;

    // Default template
    const defaultResumeData = {
      profileInfo: {
        profileImg: null,
        previewUrl: '',
        fullName: '',
        designation: '',
        summary: '',
      },
      contactInfo: {
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: '',
      },
      workExperience: [
        {
          company: '',
          role: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
      education: [
        {
          degree: '',
          institution: '',
          startDate: '',
          endDate: '',
        },
      ],
      skills: [
        {
          name: '',
          progress: 0,
        },
      ],
      projects: [
        {
          title: '',
          description: '',
          github: '',
          liveDemo: '',
        },
      ],
      certifications: [
        {
          title: '',
          issuer: '',
          year: '',
        },
      ],
      languages: [
        {
          name: '',
          progress: '',
        },
      ],
      interests: [''],
    };

    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResumeData,
      ...req.body,
    });
    res.status(201).json(newResume);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to create Resume', error: error.message });
  }
};

// GET FUNCTION
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      userId: req.user._id,
    }).sort({
      updated: -1,
    });
    res.json(resumes);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to get Resumes', error: error.message });
  }
};

// GET Resume BY ID

export const getUserById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not Found' });
    }
    res.status(200).json(resume);
  } catch (error) {
    console.error('Error fetching resume by ID:', error);
    res
      .status(500)
      .json({ message: 'Failed to get Resume', error: error.message });
  }
};

//UPDATE RESUMES

export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json({ message: 'Resume not Found or not Authorized' });
    }

    // Merge updated resume
    Object.assign(resume, req.body);

    const savedResume = await resume.save();
    res.json(savedResume);
  } catch (error) {
    console.error('Error updating resume:', error);
    res
      .status(500)
      .json({ message: 'Failed to update Resume', error: error.message });
  }
};

// DELETE RESUME

export const deletedResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      return res
        .status(404)
        .json({ message: 'Resume not Found or not Authorized' });
    }

    // UPLOAD FOLDER
    const uploadFolders = path.join(process.cwd(), 'uploads');

    // DELETING THUMBNAIL
    if (resume.thumbnailLink) {
      const oldThumbnail = path.join(
        uploadFolders,
        path.basename(resume.thumbnailLink)
      );

      if (fs.existsSync(oldThumbnail)) {
        fs.unlinkSync(oldThumbnail);
      }
    }

    if (resume.profileInfo.profilePreviewUrl) {
      const oldProfile = path.join(
        uploadFolders,
        path.basename(resume.profileInfo.profilePreviewUrl)
      );
      if (fs.existsSync(oldProfile)) {
        fs.unlinkSync(oldProfile);
      }
    }

    //DELETE RESUME DOC

    const deleted = await Resume.deleteOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: 'Resume not Found or not Authorized' });
    }
    res.status(200).json({ message: 'Resume deleted succefully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to delete Resumes', error: error.message });
  }
};
