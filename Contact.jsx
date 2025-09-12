import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/contact', formData);
      if (response.data.success) {
        toast.success('Message sent successfully! We\'ll get back to you soon. 📧');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email Us',
      content: 'hello@blogspace.com',
      description: 'Send us an email anytime'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      content: 'Available 24/7',
      description: 'Get instant help'
    },
    {
      icon: '🌍',
      title: 'Location',
      content: 'San Francisco, CA',
      description: 'Our headquarters'
    }
  ];

  const faqs = [
    {
      question: 'How do I create my first blog post?',
      answer: 'After signing up, simply click on "Write" in the navigation menu and start creating your first post!'
    },
    {
      question: 'Is BlogSpace free to use?',
      answer: 'Yes! BlogSpace is completely free for all writers. We believe in making blogging accessible to everyone.'
    },
    {
      question: 'Can I import my existing blog?',
      answer: 'Absolutely! Contact our support team and we\'ll help you migrate your existing content.'
    },
    {
      question: 'How do I grow my audience?',
      answer: 'Focus on creating quality content, engage with other writers, and use relevant tags to increase discoverability.'
    }
  ];

  return (
    <div className="contact-page">
      <div className="container">
        {/* Header */}
        <section className="contact-header">
          <h1>📧 Get in Touch</h1>
          <p>We'd love to hear from you! Send us a message and we'll respond as soon as possible.</p>
        </section>

        <div className="contact-content">
          {/* Contact Info */}
          <div className="contact-info">
            <h2>🤝 Let's Connect</h2>
            <p>Whether you have a question, feedback, or just want to say hello, we're here for you.</p>
            
            <div className="contact-cards">
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-card">
                  <div className="contact-icon">{info.icon}</div>
                  <h3>{info.title}</h3>
                  <div className="contact-content">{info.content}</div>
                  <p>{info.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <form onSubmit={handleSubmit} className="contact-form">
              <h3>✉️ Send us a Message</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    <span className="label-icon">👤</span>
                    <span>Your Name</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <span className="label-icon">📧</span>
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  <span className="label-icon">📝</span>
                  <span>Subject</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="What's this about?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  <span className="label-icon">💭</span>
                  <span>Message</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Tell us what's on your mind..."
                  rows="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>❓ Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
