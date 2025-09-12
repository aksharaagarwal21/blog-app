import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  const features = [
    {
      icon: '✍️',
      title: 'Write & Share',
      description: 'Create beautiful blog posts with our intuitive editor and share your stories with the world.'
    },
    {
      icon: '👥',
      title: 'Connect',
      description: 'Build a community around your content. Engage with readers through comments and likes.'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Monitor your blog\'s performance with detailed analytics and insights.'
    },
    {
      icon: '🎨',
      title: 'Beautiful Design',
      description: 'Enjoy a clean, modern interface that makes writing and reading a pleasure.'
    },
    {
      icon: '🔐',
      title: 'Secure',
      description: 'Your data is protected with industry-standard security measures.'
    },
    {
      icon: '📱',
      title: 'Responsive',
      description: 'Access your blog from any device - desktop, tablet, or mobile.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Passionate writer and tech entrepreneur with 10+ years of experience.',
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Chen',
      role: 'CTO',
      bio: 'Full-stack developer who loves creating beautiful, functional web applications.',
      avatar: '👨‍💻'
    },
    {
      name: 'Emma Davis',
      role: 'Head of Design',
      bio: 'UX/UI designer focused on creating intuitive and delightful user experiences.',
      avatar: '👩‍🎨'
    }
  ];

  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <h1>✨ About BlogSpace</h1>
            <p className="hero-subtitle">
              Empowering writers to share their stories and connect with readers worldwide
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-content">
            <h2>🎯 Our Mission</h2>
            <p>
              At BlogSpace, we believe everyone has a story worth telling. Our mission is to provide 
              writers with the tools and platform they need to share their thoughts, experiences, 
              and expertise with the world. We're building more than just a blogging platform – 
              we're creating a community where ideas flourish and connections are made.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>🚀 What Makes Us Special</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <h2>📈 Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">👥 Active Writers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">📚 Blog Posts</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">👀 Monthly Readers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">25+</div>
              <div className="stat-label">🌍 Countries</div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2>👥 Meet Our Team</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">{member.avatar}</div>
                <h3>{member.name}</h3>
                <div className="team-role">{member.role}</div>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <h2>💎 Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">🌟</div>
              <h3>Quality First</h3>
              <p>We prioritize quality in everything we do, from our platform to our community.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🤝</div>
              <h3>Community</h3>
              <p>We foster a supportive environment where writers can grow and learn together.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🚀</div>
              <h3>Innovation</h3>
              <p>We continuously improve and innovate to provide the best blogging experience.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🔓</div>
              <h3>Accessibility</h3>
              <p>We believe blogging should be accessible to everyone, regardless of technical skill.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Start Your Blogging Journey? 🚀</h2>
            <p>Join thousands of writers who have already discovered the joy of sharing their stories on BlogSpace.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                <span>✨</span>
                <span>Get Started Free</span>
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">
                <span>📧</span>
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
