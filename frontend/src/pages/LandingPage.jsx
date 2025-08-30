import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Atom, X, Menu, ArrowRight, Download } from 'lucide-react';
import { landingPageStyles } from '../assets/dummystyle.js';
import { UserContext } from '../context/UserContext';
import { ProfileInfoCard } from '../components/Cards.jsx';
import { Zap } from 'lucide-react';
import { RectangleGroupIcon as LayoutTemplate } from '@heroicons/react/24/outline';
import { Modal } from '../components/Modal';
import  Login  from '../components/Login';
import SignUp  from '../components/SignUp';

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className={landingPageStyles.container}>
      {/* Header */}
      <header className={landingPageStyles.header}>
        <div className={landingPageStyles.headerContainer}>
          <div className={landingPageStyles.logoContainer}>
            <div className={landingPageStyles.logoIcon}>   
              <Atom className={landingPageStyles.logoIconInner} />          
            </div>
            <span className={landingPageStyles.logoText}>
              ResuMate
            </span>
          </div>

          <button 
            className={landingPageStyles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} className={landingPageStyles.mobileMenuIcon} />
            ) : (
              <Menu size={24} className={landingPageStyles.mobileMenuIcon} />
            )}
          </button>

          <div className='hidden md:flex items-center'>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button 
                className={landingPageStyles.desktopAuthButton} 
                onClick={() => setOpenAuthModal(true)}
              >
                <div className={landingPageStyles.desktopAuthButtonOverlay}></div>
                <span className={landingPageStyles.desktopAuthButtonText}>Get Started</span>
              </button>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={landingPageStyles.mobileMenu}>
            <div className={landingPageStyles.mobileMenuContainer}>
              {user ? (
                <div className={landingPageStyles.mobileUserInfo}>
                  <div className={landingPageStyles.mobileUserWelcome}>
                    Welcome Back 
                  </div>
                  <button 
                    className={landingPageStyles.mobileDashboardButton} 
                    onClick={() => {
                      navigate('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <button 
                  className={landingPageStyles.mobileAuthButton}
                  onClick={() => {
                    setOpenAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className={landingPageStyles.main}>
        <section className={landingPageStyles.heroSection}>
          {/* Fixed Hero Grid Container */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 min-h-[600px] w-full">
            
            {/* Left Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 lg:space-y-8">
                <div className={landingPageStyles.tagline}>
                  Professional Resume Builder
                </div>

                <h1 className={landingPageStyles.heading}>
                  <span className={landingPageStyles.headingText}>Craft </span>
                  <span className={`${landingPageStyles.headingGradient} px-1 -mx-1`}>Professional </span>
                  <span className={landingPageStyles.headingText}>Resumes</span>
                </h1>

                <p className={landingPageStyles.description}>
                  Create job-winning resumes with expertly designed templates.
                  ATS-friendly, recruiter-approved, and tailored to your career goals
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className={landingPageStyles.primaryButton} onClick={handleCTA}>
                    <div className={landingPageStyles.primaryButtonOverlay}></div>
                    <span className={landingPageStyles.primaryButtonContent}>
                      START BUILDING 
                      <ArrowRight className={landingPageStyles.primaryButtonIcon} size={18}/>
                    </span>
                  </button>
                  <button 
                    className={landingPageStyles.secondaryButton} 
                    onClick={() => navigate('/templates')}
                  >
                    View Templates
                  </button>
                </div>

                {/* STATS GRID */}
               <div className="flex flex-row flex-wrap justify-center gap-4 mt-8 sm:grid sm:grid-cols-3">
                  {[
                    { value: '100K+', label: 'Resumes Created', gradient: 'from-violet-600 to-fuchsia-600' },
                    { value: '4.9★', label: 'User Rating', gradient: 'from-orange-500 to-red-500' },
                    { value: '5 Min', label: 'Build Time', gradient: 'from-emerald-500 to-teal-500' },
                  ].map((stat, idx) => (
                    <div className={landingPageStyles.statItem} key={idx}>
                      <div className={`${landingPageStyles.statNumber} bg-gradient-to-r ${stat.gradient}`}>
                        {stat.value}
                      </div>
                      <div className={landingPageStyles.statLabel}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Content - SVG Illustration */}
              <div className="w-full lg:w-1/2 flex justify-center items-center relative">
                <div className={landingPageStyles.heroIllustrationBg}></div>
                <div className="w-full max-w-md lg:max-w-lg relative z-10">
                  <svg
                    viewBox="0 0 400 500"
                    preserveAspectRatio="xMidYMid meet"
                    className="w-full h-auto"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                      <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#f8fafc" />
                      </linearGradient>
                    </defs>

                    <rect x="50" y="50" width="300" height="400" rx="20" className={landingPageStyles.svgRect} />
                    <circle cx="120" cy="120" r="25" className={landingPageStyles.svgCircle} />
                    <rect x="160" y="105" width="120" height="8" rx="4" className={landingPageStyles.svgRectPrimary} />
                    <rect x="160" y="120" width="80" height="6" rx="3" className={landingPageStyles.svgRectSecondary} />
                    <rect x="70" y="170" width="260" height="4" rx="2" className={landingPageStyles.svgRectLight} />
                    <rect x="70" y="185" width="200" height="4" rx="2" className={landingPageStyles.svgRectLight} />
                    <rect x="70" y="200" width="240" height="4" rx="2" className={landingPageStyles.svgRectLight} />
                    <rect x="70" y="230" width="60" height="6" rx="3" className={landingPageStyles.svgRectPrimary} />
                    <rect x="70" y="250" width="40" height="15" rx="7" className={landingPageStyles.svgRectSkill} />
                    <rect x="120" y="250" width="50" height="15" rx="7" className={landingPageStyles.svgRectSkill} />
                    <rect x="180" y="250" width="45" height="15" rx="7" className={landingPageStyles.svgRectSkill} />
                    <rect x="70" y="290" width="80" height="6" rx="3" className={landingPageStyles.svgRectSecondary} />
                    <rect x="70" y="310" width="180" height="4" rx="2" className={landingPageStyles.svgRectLight} />
                    <rect x="70" y="325" width="150" height="4" rx="2" className={landingPageStyles.svgRectLight} />
                    <rect x="70" y="340" width="200" height="4" rx="2" className={landingPageStyles.svgRectLight} />

                    <circle cx="320" cy="100" r="15" className={landingPageStyles.svgAnimatedCircle}>
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-10; 0,0"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <rect x="30" y="300" width="12" height="12" rx="6" className={landingPageStyles.svgAnimatedRect}>
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 5,0; 0,0"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </rect>
                    <polygon points="360,200 370,220 350,220" className={landingPageStyles.svgAnimatedPolygon}>
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="0 360 210; 360 360 210; 0 360 210"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </polygon>                                                                                                                                     
                  </svg>
                </div>
              </div>
            </div>
        </section>

        {/* Features Section */}
        <section className={landingPageStyles.featuresSection}>
          <div className={landingPageStyles.featuresContainer}>
            <div className={landingPageStyles.featuresHeader}>
              <h2 className={landingPageStyles.featuresTitle}>
                Why Us <span className={landingPageStyles.featuresTitleGradient}>
                  ResuMate?
                </span>
              </h2>
              <p className={landingPageStyles.featureDescription}>
                MAKE YOUR DREAM RESUME
              </p>
            </div>
            <div className={landingPageStyles.featuresGrid}>
              {[
                                {
                                    icon: <Zap className={landingPageStyles.featureIcon} />,
                                    title: "Lightning Fast",
                                    description: "Create professional resumes in under 5 minutes with our streamlined process",
                                    gradient: landingPageStyles.featureIconEmerald,
                                    bg: landingPageStyles.featureCardEmerald
                                },
                                {
                                    icon: <LayoutTemplate className={landingPageStyles.featureIcon} />,
                                    title: "Pro Templates",
                                    description: "Choose from dozens of recruiter-approved, industry-specific templates",
                                    gradient: landingPageStyles.featureIconTeal,
                                    bg: landingPageStyles.featureCardGreen
                                },
                                {
                                    icon: <Download className={landingPageStyles.featureIcon} />,
                                    title: "Instant Export",
                                    description: "Download high-quality PDFs instantly with perfect formatting",
                                    gradient: landingPageStyles.featureIconGreen,
                                    bg: landingPageStyles.featureCardTeal
                                }
                            ].map((feature, index) => (
                        <div key={index} className={landingPageStyles.featureCard}>
                       <div className={landingPageStyles.featureCardHover}></div>
                       <div className={`${landingPageStyles.featureCardContent} ${feature.bg}`}>
                      <div className={`${landingPageStyles.featureIconContainer} ${feature.gradient}`}>
                           {feature.icon}
                            </div>
                    <h3 className={landingPageStyles.featureTitle}>
                         {feature.title}
                            </h3>
                      <p className={landingPageStyles.featureDescription}>
                      {feature.description}
                     </p>
               </div>
           </div>
))}
            </div>
          </div>
        </section>
{/*   CTA Section */}

<section className={landingPageStyles.ctaSection}>
  <div className={landingPageStyles.ctaContainer}>
    <div className={landingPageStyles.ctaCard}>
      <div className={landingPageStyles.ctaCardBg}></div>
      <div className={landingPageStyles.ctaCardContent}>
        <h2 className={landingPageStyles.ctaTitle}>
          Ready to Build Your <span className={landingPageStyles.ctaTitleGradient}>
            Stunning Resume
          </span>
        </h2>

        <p className={landingPageStyles.ctaDescription}>
  Join thousands of professionals who landed their dream jobs with our platform
</p>
<button className={landingPageStyles.ctaButton} onClick={handleCTA}>
  <div className={landingPageStyles.ctaButtonOverlay}></div>
  <span className={landingPageStyles.ctaButtonText}>Start Building Now</span>
</button>
      </div>
    </div>
  </div>

</section>
      </main>
<Modal 
  isOpen={openAuthModal} 
  onClose={() => {
    setOpenAuthModal(false);
    setCurrentPage("login");
  }}
  hideHeader
>
  <div key={currentPage}>  {/* Add key to force re-render */}
    {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
    {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
  </div>
</Modal>

    </div>
  );
};

export default LandingPage;