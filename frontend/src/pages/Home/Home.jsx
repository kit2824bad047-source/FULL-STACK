import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

function Home() {
  const { token } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuresData = [
    {
      id: 1,
      icon: '🎯',
      title: 'For Students',
      shortDesc: 'Browse thousands of job opportunities, build your profile, and apply to positions that match your skills and career goals.',
      details: (
        <>
          <h4>Empower Your Career Journey</h4>
          <p>Our student-centric platform offers:</p>
          <ul>
            <li><strong>Smart Profile Builder:</strong> Create a standout resume with our guided tools.</li>
            <li><strong>Job Matching:</strong> AI-driven recommendations based on your skills.</li>
            <li><strong>Application Tracking:</strong> Monitor your status in real-time.</li>
            <li><strong>Skill Assessments:</strong> Prove your worth with integrated coding tests.</li>
          </ul>
        </>
      )
    },
    {
      id: 2,
      icon: '💼',
      title: 'For Recruiters',
      shortDesc: 'Post job listings, review qualified candidates, and manage your hiring process all in one intuitive platform.',
      details: (
        <>
          <h4>Streamline Your Hiring</h4>
          <p>Tools designed for modern recruitment:</p>
          <ul>
            <li><strong>Easy Job Posting:</strong> Reach thousands of candidates in clicks.</li>
            <li><strong>Advanced Filters:</strong> Screen candidates by GPA, skills, and projects.</li>
            <li><strong>Interview Scheduling:</strong> Integrated calendar for seamless coordination.</li>
            <li><strong>Talent Pool:</strong> Access a database of verified student profiles.</li>
          </ul>
        </>
      )
    },
    {
      id: 3,
      icon: '📊',
      title: 'Advanced Analytics',
      shortDesc: 'Track application status, view analytics, and make data-driven hiring decisions with our comprehensive dashboard.',
      details: (
        <>
          <h4>Data-Driven Decisions</h4>
          <p>Gain insights with powerful analytics:</p>
          <ul>
            <li><strong>Placement Trends:</strong> Visualize hiring rates year-over-year.</li>
            <li><strong>Salary Insights:</strong> Compare package offers across industries.</li>
            <li><strong>Company Engagement:</strong> See which firms are active and hiring.</li>
            <li><strong>Student Performance:</strong> Track class-level statistics.</li>
          </ul>
        </>
      )
    },
    {
      id: 4,
      icon: '🔒',
      title: 'Secure & Reliable',
      shortDesc: 'Your data is safe with us. Enterprise-grade security ensures all information is protected at all times.',
      details: (
        <>
          <h4>Security First</h4>
          <p>We prioritize your privacy and data integrity:</p>
          <ul>
            <li><strong>End-to-End Encryption:</strong> Your personal data is always encrypted.</li>
            <li><strong>Role-Based Access:</strong> Strict controls for students vs. recruiters.</li>
            <li><strong>Regular Audits:</strong> Continuous security checks to prevent breaches.</li>
            <li><strong>Compliance:</strong> Adhering to data protection standards.</li>
          </ul>
        </>
      )
    }
  ];

  const handleLearnMore = (e, feature) => {
    e.preventDefault();
    setActiveFeature(feature);
  };

  const closeModal = () => {
    setActiveFeature(null);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="animated-bg"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-text-wrapper">
            <h1 className="hero-title">Welcome to Campus Placement System</h1>
            <p className="hero-subtitle">
              Connecting Top Talent with Leading Employers
            </p>
            <p className="hero-description">
              Your gateway to career success - Find opportunities, showcase talent, and build your future
            </p>
          </div>

          {!token && (
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-glow">
                <span className="btn-text">Get Started</span>
                <span className="btn-icon">→</span>
              </Link>
              <Link to="/login" className="btn btn-secondary btn-glow">
                <span className="btn-text">Sign In</span>
              </Link>
            </div>
          )}
          {token && (
            <div className="hero-message">
              <p>🎉 Ready to explore amazing opportunities? Head to your dashboard!</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Create Profile</h3>
              <p>Sign up and build your professional profile with skills and experience</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Browse Jobs</h3>
              <p>Explore thousands of job opportunities from top companies</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Apply & Connect</h3>
              <p>Apply to positions and connect with recruiters directly</p>
            </div>
            <div className="step-card">
              <div className="step-number">04</div>
              <h3>Get Hired</h3>
              <p>Interview and land your dream job at leading companies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            {featuresData.map((feature) => (
              <div className="feature-card" key={feature.id}>
                <div className="feature-icon-bg">
                  <div className="feature-icon">{feature.icon}</div>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.shortDesc}</p>
                <a
                  href="#learn-more"
                  className="feature-link"
                  onClick={(e) => handleLearnMore(e, feature)}
                >
                  Learn more →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">👥</div>
              <h3 className="stat-number">5,000+</h3>
              <p>Active Students</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🏢</div>
              <h3 className="stat-number">500+</h3>
              <p>Registered Companies</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon">💼</div>
              <h3 className="stat-number">10,000+</h3>
              <p>Job Opportunities</p>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <h3 className="stat-number">95%</h3>
              <p>Placement Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="section-container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">"This platform helped me land my dream job! The interface is intuitive and the support team is fantastic."</p>
              <div className="testimonial-author">
                <div className="author-avatar">👨</div>
                <div className="author-info">
                  <p className="author-name">Raj Kumar</p>
                  <p className="author-role">Software Engineer</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">"As a recruiter, this platform streamlined our entire hiring process. We found amazing talent quickly!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">👩</div>
                <div className="author-info">
                  <p className="author-name">Sarah Johnson</p>
                  <p className="author-role">HR Manager</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">"Outstanding platform! Got 5 interview calls within 2 weeks of applying. Highly recommended!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">👨</div>
                <div className="author-info">
                  <p className="author-name">Aditya Sharma</p>
                  <p className="author-role">Product Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="section-container">
          <h2>Ready to Transform Your Career?</h2>
          <p>Join thousands of successful students and companies on our platform</p>
          {!token && (
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large btn-glow">
                <span className="btn-text">Create Your Account</span>
                <span className="btn-icon">✨</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Feature Details Modal */}
      {activeFeature && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>&times;</button>
            <div className="modal-header">
              <div className="modal-icon">{activeFeature.icon}</div>
              <h3>{activeFeature.title}</h3>
            </div>
            <div className="modal-body">
              {activeFeature.details}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
