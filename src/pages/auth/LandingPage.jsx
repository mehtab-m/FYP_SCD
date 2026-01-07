// src/pages/auth/LandingPage.jsx
import React, { useState, useEffect } from "react";
import "./LandingPage.css";
import LoginModal from "./LoginModal";
import MyLogo from "../../assets/icons/logo.png";
import { 
  FaRocket, 
  FaUsers, 
  FaChartLine, 
  FaShieldAlt, 
  FaCheckCircle,
  FaArrowRight,
  FaGraduationCap,
  FaFileAlt,
  FaAward,
  FaClock,
  FaMoon,
  FaSun
} from "react-icons/fa";

const LandingPage = ({ setUser }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const features = [
    {
      icon: <FaUsers />,
      title: "Collaborative Groups",
      description: "Seamlessly form teams, manage members, and collaborate on projects with real-time updates."
    },
    {
      icon: <FaFileAlt />,
      title: "Document Management",
      description: "Submit, review, and track all project documents with version control and deadline tracking."
    },
    {
      icon: <FaChartLine />,
      title: "Progress Monitoring",
      description: "Real-time progress tracking with comprehensive analytics and performance insights."
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Platform",
      description: "Enterprise-grade security with role-based access control and data encryption."
    },
    {
      icon: <FaAward />,
      title: "Evaluation System",
      description: "Comprehensive grading system with supervisor and committee evaluation workflows."
    },
    {
      icon: <FaClock />,
      title: "Deadline Management",
      description: "Automated deadline tracking with notifications and submission status monitoring."
    }
  ];

  const benefits = [
    "Streamlined project registration and approval process",
    "Real-time collaboration and communication tools",
    "Automated document submission and tracking",
    "Comprehensive evaluation and grading system",
    "Role-based access for students, supervisors, and committees",
    "Advanced analytics and reporting capabilities"
  ];

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="landing-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <img src={MyLogo} alt="ProjectSphere" className="navbar-logo" />
            <span className="navbar-title">ProjectSphere</span>
          </div>
          <div className="navbar-menu">
            <a href="#features" className="nav-link" onClick={(e) => handleNavClick(e, 'features')}>Features</a>
            <a href="#benefits" className="nav-link" onClick={(e) => handleNavClick(e, 'benefits')}>Benefits</a>
            <a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, 'about')}>About</a>
            <button 
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button 
              className="nav-login-btn"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <FaRocket className="badge-icon" />
            <span>Enterprise-Grade FYP Management Platform</span>
          </div>
          <h1 className="hero-title">
            Powering Ideas into
            <span className="gradient-text"> Impact</span>
          </h1>
          <p className="hero-description">
            Transform your Final Year Project management with our comprehensive platform. 
            Streamline workflows, enhance collaboration, and deliver exceptional results 
            with enterprise-grade tools designed for academic excellence.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">$100M+</div>
              <div className="stat-label">Project Value</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">10K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">500+</div>
              <div className="stat-label">Institutions</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
          <div className="hero-cta">
            <button 
              className="cta-primary"
              onClick={() => setShowLoginModal(true)}
            >
              Get Started
              <FaArrowRight className="cta-icon" />
            </button>
            <button className="cta-secondary">
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <FaGraduationCap />
            <span>Students</span>
          </div>
          <div className="floating-card card-2">
            <FaUsers />
            <span>Supervisors</span>
          </div>
          <div className="floating-card card-3">
            <FaAward />
            <span>Committees</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">
              Everything you need to manage Final Year Projects efficiently
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits-section">
        <div className="section-container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2 className="section-title">Why Choose ProjectSphere?</h2>
              <p className="benefits-intro">
                Join thousands of institutions worldwide using ProjectSphere to 
                revolutionize their Final Year Project management.
              </p>
              <ul className="benefits-list">
                {benefits.map((benefit, index) => (
                  <li key={index} className="benefit-item">
                    <FaCheckCircle className="benefit-icon" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <button 
                className="benefits-cta"
                onClick={() => setShowLoginModal(true)}
              >
                Start Your Journey
                <FaArrowRight className="cta-icon" />
              </button>
            </div>
            <div className="benefits-visual">
              <div className="visual-card">
                <div className="visual-stat">
                  <div className="visual-number">100%</div>
                  <div className="visual-label">Satisfaction Rate</div>
                </div>
                <div className="visual-progress">
                  <div className="progress-bar" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="visual-card">
                <div className="visual-stat">
                  <div className="visual-number">50K+</div>
                  <div className="visual-label">Projects Managed</div>
                </div>
                <div className="visual-progress">
                  <div className="progress-bar" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div className="visual-card">
                <div className="visual-stat">
                  <div className="visual-number">24/7</div>
                  <div className="visual-label">Support Available</div>
                </div>
                <div className="visual-progress">
                  <div className="progress-bar" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="about-content">
            <div className="about-image">
              <img src={MyLogo} alt="ProjectSphere" className="about-logo" />
            </div>
            <div className="about-text">
              <h2 className="section-title">Built for Excellence</h2>
              <p className="about-description">
                ProjectSphere is the result of years of research and development, 
                designed specifically to address the unique challenges of Final Year 
                Project management in academic institutions.
              </p>
              <p className="about-description">
                Our platform combines cutting-edge technology with intuitive design 
                to deliver a seamless experience for students, supervisors, and 
                administrative committees alike.
              </p>
              <div className="about-highlights">
                <div className="highlight-item">
                  <div className="highlight-number">2024</div>
                  <div className="highlight-label">Latest Technology</div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-number">ISO</div>
                  <div className="highlight-label">Certified Security</div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-number">99.9%</div>
                  <div className="highlight-label">Reliability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your FYP Management?</h2>
            <p className="cta-description">
              Join thousands of institutions already using ProjectSphere to streamline 
              their Final Year Project workflows.
            </p>
            <button 
              className="cta-button-large"
              onClick={() => setShowLoginModal(true)}
            >
              Get Started Today
              <FaArrowRight className="cta-icon" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <img src={MyLogo} alt="ProjectSphere" className="footer-logo" />
            <span className="footer-title">ProjectSphere</span>
            <p className="footer-tagline">Powering Ideas into Impact</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#benefits">Benefits</a>
              <a href="#about">About</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#">Documentation</a>
              <a href="#">Help Center</a>
              <a href="#">Contact Us</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 ProjectSphere. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          setUser={setUser}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
};

export default LandingPage;

