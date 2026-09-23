import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchFeedback, submitFeedback } from "../services/feedback.service";

const SUBJECT_OPTIONS = [
  "Product Inquiry",
  "General Inquiry",
  "Order Related",
  "Payment Related",
  "Complaint",
  "Suggestion",
  "Other",
];

const CURATED_STORIES = [
  {
    id: "story-1",
    name: "Aarohi",
    occasion: "Birthday Gift",
    text: "The bouquet was even more beautiful in person. You can really see the love and effort in every flower.",
  },
  {
    id: "story-2",
    name: "Riya",
    occasion: "Special Gift",
    text: "Such a unique gift idea! The flowers looked absolutely beautiful and I love that they will last forever.",
  },
  {
    id: "story-3",
    name: "Ananya",
    occasion: "Anniversary Gift",
    text: "The detailing is amazing. It felt so personal and thoughtful, and the bouquet made the moment extra special.",
  },
];

function Feedback({ cartCount }) {
  const pageRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "Product Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const [feedbackList, setFeedbackList] = useState(CURATED_STORIES);

  /**
   * Load submitted feedback from backend API
   */
  useEffect(() => {
    async function loadFeedback() {
      try {
        const data = await fetchFeedback();
        if (Array.isArray(data?.feedback) && data.feedback.length > 0) {
          const apiFeedback = data.feedback.map((item) => ({
            id: item._id,
            name: item.fullName,
            text: item.message,
            occasion: item.subject,
            createdAt: item.createdAt,
          }));
          setFeedbackList([...apiFeedback, ...CURATED_STORIES]);
        }
      } catch {
        // Fall back gracefully to curated feedback if not logged in as seller
      }
    }

    loadFeedback();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline
        .from(".feedback-page-header > *", {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        })
        .from(
          ".feedback-page-card",
          {
            opacity: 0,
            y: 40,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          ".feedback-stories-section",
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3"
        );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (statusMessage) {
      setStatusMessage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    // Client-side validations
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setStatusMessage({
        type: "error",
        text: "Please enter your full name (at least 2 characters).",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setStatusMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setStatusMessage({
        type: "error",
        text: "Please write a message with at least 10 characters.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await submitFeedback(formData);

      setStatusMessage({
        type: "success",
        text: res?.message || "Thank you! Your feedback has been warmly received.",
      });

      // Clear form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "Product Inquiry",
        message: "",
      });

      // Append new feedback to display list immediately
      const newEntry = {
        id: res?.feedback?._id || `submitted-${Date.now()}`,
        name: formData.fullName.trim(),
        text: formData.message.trim(),
        occasion: formData.subject,
        createdAt: new Date().toISOString(),
      };

      setFeedbackList((prev) => [newEntry, ...prev]);
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to submit feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-page" ref={pageRef}>
      <Navbar cartCount={cartCount} />

      <main className="feedback-page-main">
        {/* ========================================
            HERO HEADER
        ======================================== */}
        <section className="feedback-page-header">
          <p className="feedback-page-label">
            ✦ WE CHERISH YOUR THOUGHTS
          </p>

          <h1 className="feedback-page-title">
            Share your
            <br />
            <span>experience.</span>
          </h1>

          <p className="feedback-page-intro">
            Every handcrafted stem carries an intention. We would love to hear
            how our bouquets made your celebrations, surprises, or everyday spaces bloom.
          </p>
        </section>

        {/* ========================================
            FEEDBACK FORM CARD
        ======================================== */}
        <section className="feedback-page-card-wrapper">
          <div className="feedback-page-card">
            <div className="feedback-card-heading">
              <span className="feedback-card-flower">✿</span>
              <h2>Customer Review & Inquiry</h2>
              <p>
                Your feedback helps our florists nurture and perfect every creation.
              </p>
            </div>

            {statusMessage && (
              <div
                className={`feedback-alert feedback-alert-${statusMessage.type}`}
                role="alert"
              >
                <span className="feedback-alert-icon">
                  {statusMessage.type === "success" ? "✿" : "!"}
                </span>
                <p className="feedback-alert-text">{statusMessage.text}</p>
              </div>
            )}

            <form className="feedback-form" onSubmit={handleSubmit} noValidate>
              <div className="feedback-form-grid">
                {/* Full Name */}
                <div className="feedback-form-group">
                  <label htmlFor="feedback-page-name">
                    FULL NAME <span>*</span>
                  </label>
                  <input
                    id="feedback-page-name"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="feedback-form-group">
                  <label htmlFor="feedback-page-email">
                    EMAIL ADDRESS <span>*</span>
                  </label>
                  <input
                    id="feedback-page-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="feedback-form-group">
                  <label htmlFor="feedback-page-phone">
                    PHONE NUMBER <span className="optional-tag">(Optional)</span>
                  </label>
                  <input
                    id="feedback-page-phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Occasion / Subject */}
                <div className="feedback-form-group">
                  <label htmlFor="feedback-page-subject">
                    OCCASION / INQUIRY TYPE <span>*</span>
                  </label>
                  <div className="feedback-select-wrapper">
                    <select
                      id="feedback-page-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      required
                    >
                      {SUBJECT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <span className="select-arrow">↓</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="feedback-form-group feedback-message-group">
                <label htmlFor="feedback-page-message">
                  YOUR MESSAGE / REVIEW <span>*</span>
                </label>
                <textarea
                  id="feedback-page-message"
                  name="message"
                  rows="5"
                  placeholder="Tell us about the bouquet you received, the recipient's reaction, or any suggestions you have..."
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
                <span className="feedback-char-hint">
                  Min. 10 characters ({formData.message.trim().length}/2000)
                </span>
              </div>

              {/* Submit Row */}
              <div className="feedback-submit-row">
                <button
                  type="submit"
                  className="feedback-submit-btn"
                  disabled={isSubmitting}
                >
                  <span>
                    {isSubmitting ? "SUBMITTING REVIEW..." : "SUBMIT FEEDBACK"}
                  </span>
                  <span className="feedback-btn-icon">✿</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ========================================
            STORIES / REVIEWS GRID
        ======================================== */}
        <section className="feedback-stories-section">
          <div className="feedback-stories-header">
            <p className="feedback-page-label">✦ KIND WORDS FROM OUR COMMUNITY</p>
            <h2>Recent Customer Stories</h2>
            <p>Read what others have shared about their Florenza Bloom experience.</p>
          </div>

          <div className="reviews-grid">
            {feedbackList.map((story) => (
              <article className="review-card" key={story.id || story.name}>
                <div className="review-quote">“</div>
                <div className="review-stars">★ ★ ★ ★ ★</div>
                <p className="review-text">{story.text}</p>
                <div className="review-line"></div>
                <h3>{story.name}</h3>
                <p className="review-occasion">{story.occasion}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Feedback;
