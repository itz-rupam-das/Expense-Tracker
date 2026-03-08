import { useState } from 'react';
import { Mail, MessageSquare, Send, Github, Linkedin, Instagram } from 'lucide-react';
import './Contact.css';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send email via mailto (Change 4)
        const subject = encodeURIComponent(`Expense Tracker Feedback from ${formData.name}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        );
        window.open(`mailto:hallabolgaming@gmail.com?subject=${subject}&body=${body}`, '_blank');
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <div className="page-container" id="contact-page">
            <h1 className="page-title">
                <span className="gradient-text">Contact</span>
            </h1>
            <p className="page-subtitle">Get in touch with the developer</p>

            <div className="contact-grid">
                {/* Developer Info */}
                <div className="developer-card glass-card">
                    <div className="dev-avatar">
                        <img src="/Expense-Tracker/pic-rupam-insta.jpeg" alt="Rupam Das" className="dev-avatar-img" />
                    </div>
                    <h3 className="dev-name">Rupam Das</h3>
                    <p className="dev-role">BCA Student — MAKAUT</p>
                    <p className="dev-desc">
                        Full-stack web developer passionate about building clean, modern applications
                        that solve real-world problems.
                    </p>

                    <div className="dev-links">
                        <a href="mailto:rdas4098@gmail.com" className="dev-link" aria-label="Email">
                            <Mail size={18} />
                            <span>rdas4098@gmail.com</span>
                        </a>
                        <a href="https://github.com/itz-rupam-das" target="_blank" rel="noopener noreferrer" className="dev-link" aria-label="GitHub">
                            <Github size={18} />
                            <span>itz-rupam-das</span>
                        </a>
                        <a href="https://www.linkedin.com/in/rupam-das-kolkata" target="_blank" rel="noopener noreferrer" className="dev-link" aria-label="LinkedIn">
                            <Linkedin size={18} />
                            <span>rupam-das-kolkata</span>
                        </a>
                        <a href="https://www.instagram.com/itz_rupam_das?igsh=MXQ3bzlwczR4NTl5dQ==" target="_blank" rel="noopener noreferrer" className="dev-link" aria-label="Instagram">
                            <Instagram size={18} />
                            <span>itz_rupam_das</span>
                        </a>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="contact-form-card glass-card">
                    <h3 className="section-title">
                        <MessageSquare size={20} /> Send Feedback
                    </h3>

                    {submitted && (
                        <div className="success-message">
                            ✅ Thank you! Your email client has been opened to send the feedback.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} id="contact-form">
                        <div className="form-group">
                            <label className="input-label" htmlFor="contact-name">Name</label>
                            <input
                                type="text"
                                id="contact-name"
                                className="input-field"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="input-label" htmlFor="contact-email">Email</label>
                            <input
                                type="email"
                                id="contact-email"
                                className="input-field"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="input-label" htmlFor="contact-message">Message</label>
                            <textarea
                                id="contact-message"
                                className="input-field contact-textarea"
                                placeholder="Write your message or feedback..."
                                rows="5"
                                value={formData.message}
                                onChange={(e) => handleChange('message', e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-primary contact-submit" id="send-message-btn">
                            <Send size={16} />
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
