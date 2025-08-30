import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';  
import { dashboardStyles as styles } from '../assets/dummystyle.js';
import { useNavigate } from 'react-router-dom';
import { LucideFilePlus, LucideTable2 } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance.js';
import { API_PATHS } from '../utils/apiPaths.js';
import { ResumeSummaryCard } from '../components/Cards.jsx';
import toast from 'react-hot-toast'
import moment from 'moment'
import { Modal } from '../components/Modal.jsx';
import CreateResumeForm from '../components/CreateResumeForm.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const [openCreateModel, setOpenCreateModel] = useState(false);
  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Calculate completion percentage for a resume
  const calculateCompletion = (resume) => {
  if (!resume) return 0;
  
  // Profile Info
  const profileFields = [
    resume.profileInfo?.fullName,
    resume.profileInfo?.designation,
    resume.profileInfo?.summary
  ];

  // Contact Info
  const contactFields = [
    resume.contactInfo?.email,
    resume.contactInfo?.phone
  ];

  // Work Experience
  const workFields = resume.workExperience?.flatMap(exp => [
    exp.company,
    exp.role,
    exp.startDate,
    exp.endDate,
    exp.description
  ]) || [];

  // Education
  const educationFields = resume.education?.flatMap(edu => [
    edu.degree,
    edu.institution,
    edu.startDate,
    edu.endDate
  ]) || [];

  // Skills
  const skillFields = resume.skills?.flatMap(skill => [
    skill.name,
    skill.progress > 0
  ]) || [];

  // Projects
  const projectFields = resume.projects?.flatMap(project => [
    project.title,
    project.description,
    project.github,
    project.liveDemo
  ]) || [];

  // Certifications
  const certificationFields = resume.certifications?.flatMap(cert => [
    cert.title,
    cert.issuer,
    cert.year
  ]) || [];

  // Languages
  const languageFields = resume.languages?.flatMap(lang => [
    lang.name,
    lang.progress > 0
  ]) || [];

  // Interests
  const interestFields = resume.interests?.filter(Boolean) || [];

  // Combine all fields
  const allFields = [
    ...profileFields,
    ...contactFields,
    ...workFields,
    ...educationFields,
    ...skillFields,
    ...projectFields,
    ...certificationFields,
    ...languageFields,
    ...interestFields
  ];

  const completedFields = allFields.filter(Boolean).length;
  const totalFields = allFields.length;

  return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
};

  const fetchAllResumes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);

      const resumesWithCompletion = response.data.map(resume => ({
        ...resume,
        completion: calculateCompletion(resume)
      }));
      
      setAllResumes(resumesWithCompletion);
    } catch (error) {
      console.error('Error Fetching Resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllResumes();
  }, []);

const handleDeleteResume = async () => {
  if (!resumeToDelete) return;

  try {
    await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeToDelete));
    toast.success('Resume deleted successfully');
    fetchAllResumes(); 
  } catch (error) {
    console.error('Error deleting resume:', error);
    toast.error('Failed to delete resume');
  } finally {
    setResumeToDelete(null);
    setShowDeleteConfirm(false); 
  }
};


const handleDeleteClick = (id) => {
  setResumeToDelete(id);
  setShowDeleteConfirm(true)
}

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <div>
            <h1 className={styles.headerTitle}>My Resumes</h1>
            <p className={styles.headerSubtitle}>
              {allResumes.length > 0 
                ? `You have ${allResumes.length} resume${allResumes.length !== 1 ? 's' : ''}` 
                : 'Start building your resumes'}
            </p>
          </div>

          <div className='flex gap-4'>
            <button 
              className={styles.createButton}
              onClick={() => setOpenCreateModel(true)}
            >
              <div className={styles.createButtonOverlay}></div>
              <span className={styles.createButtonContent}>
                Create Now
                <LucideFilePlus className='group-hover:translate-x-1 transition-transform' size={18}/>
              </span>
            </button>
          </div>
        </div>

        {/* Loading State */}

        {loading && (
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner}></div>
            </div>
        )}

        {/* Empty State */}

        {!loading && allResumes.length === 0 && (
          <div className={styles.emptyStateWrapper}>
            <div className={styles.emptyIconWrapper}>
              <LucideFilePlus size= {32} className=' text-violet-400'></LucideFilePlus>
              </div>

              <h3 className={styles.emptyTitle}>No Resumes Yet</h3>
              <p className={styles.emptyText}>
                You Haven't created any resumes yet. Start building your Professional resume to land your dream job.
              </p>
              <button className={styles.createButton} onClick={ () => setOpenCreateModel(true)}>
                <div className= {styles.createButtonOverlay}></div>
                <span className={styles.createButtonContent}>
                  Create Your First Resume
                  <LucideFilePlus className='group-hover: translate-x-1 transition-transform' size= {20}/>
                </span>
              </button>
          </div>
        )}

        {!loading && allResumes.length > 0 && (
  <div className={styles.grid}>
    <div
      className={styles.newResumeCard}
      onClick={() => setOpenCreateModel(true)}
    >
      <div className={styles.newResumeIcon}>
        <LucideFilePlus size={32} className='text-white' />
      </div>
      <h3 className={styles.newResumeTitle}>Create New Resume</h3>
      <p className={styles.newResumeText}>Start building your career</p>
    </div>

    {allResumes.map((resume) => (
      <ResumeSummaryCard
  key={resume._id}
  imgUrl={resume.thumbnailLink}
  title={resume.title}
  createdAt={resume.createdAt}
  updatedAt={resume.updatedAt}
  onSelect={() => navigate(`/resume/${resume._id}`)}
  onDelete={() => handleDeleteClick(resume._id)}
  completion={resume.completion || 0}
  isPremium={resume.isPremium}
  isNew={moment().diff(moment(resume.createdAt), 'days') < 7}
/>
    ))}
  </div>
)}</div>

{/* Create Modal */}
<Modal
  isOpen={openCreateModel}
  onClose={() => setOpenCreateModel(false)}
  hideHeader
  maxWidth="max-w-2xl"
>
  <div className="p-6">
    {/* Modal Header */}
    <div className={styles.modalHeader}>
      <h3 className={styles.modalTitle}>Create New Resume</h3>
      
      {/* Close Button */}
      <button
        onClick={() => setOpenCreateModel(false)}
        className={styles.modalCloseButton}
      >
        X
      </button>
    </div>

    {/* Resume Creation Form */}
    <CreateResumeForm
      onSuccess={() => {
        setOpenCreateModel(false);
        fetchAllResumes();
      }}
    />
  </div>
</Modal>

{/* DELETE MODAL */}
<Modal isOpen={showDeleteConfirm} onClose= {() => setShowDeleteConfirm(false)} title ='Confirm Delete' showActionBtn actionBtnText = 'Delete' actionBtnClassName = 'bg-red-700 hover:bg-red-800'
onActionClick={handleDeleteResume}>
  <div className='p-8'>
    <div className='flex flex-col items-center text-center'>
      <div className= {styles.deleteIconWrapper}>
        <LucideTable2 className='
        text-orange-600' size={24}/>
      </div>
      <h3 className={styles.deleteTitle}>Delete Resume</h3>
      <p className={styles.deleteText}>
        Are you Sure want to delete this Resume ?

      </p>
    </div>
  </div>
</Modal>

    </DashboardLayout>
  );
};

export default Dashboard;