import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnailLink: {
      type: String,
    },
    template: {
      theme: String,
      colorPalette: [String],
    },
    profileInfo: {
      profilePreviewUrl: String,
      fullName: String,
      designation: String,
      summary: String,
    },

    contactInfo: {
      email: String,
      Phone: String,
      location: String,
      linkedin: String,
      github: String,
      website: String,
    },

    //work Exp

    workExperience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    //Education
    education: [
      {
        degree: String,
        institution: String,
        startDate: String,
        endDate: String,
      },
    ],

    //Skills
    skills: [
      {
        name: String,
        progress: String,
      },
    ],

    // Project
    projects: [
      {
        title: String,
        description: String,
        github: String,
        liveDemo: String,
      },
    ],

    // Certifications
    certifications: [
      {
        title: String,
        issuer: String,
        year: String,
      },
    ],

    //languages
    languages: [
      {
        name: String,
        progress: Number,
      },
    ],

    //   interest
    interest: [String],
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

export default mongoose.model('Resume', resumeSchema);
