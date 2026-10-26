import { useState } from 'react';
import { submitApplication } from '../api';

export default function ApplicationForm({ internship, onApplicationSuccess }) {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    rollNumber: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  const validate = () => {
    const errors = {};
    const name = formData.studentName.trim();
    const email = formData.email.trim();
    const roll = formData.rollNumber.trim();

    if (!name) {
      errors.studentName = 'Student name is required.';
    } else if (name.length < 2) {
      errors.studentName = 'Name must be at least 2 characters long.';
    } else if (name.length > 100) {
      errors.studentName = 'Name cannot exceed 100 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address.';
    } else if (email.length > 254) {
      errors.email = 'Email cannot exceed 254 characters.';
    }

    if (!roll) {
      errors.rollNumber = 'Roll number is required.';
    } else if (roll.length > 40) {
      errors.rollNumber = 'Roll number cannot exceed 40 characters.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        studentName: formData.studentName.trim(),
        email: formData.email.trim().toLowerCase(),
        rollNumber: formData.rollNumber.trim().toUpperCase(),
        internshipId: internship.id,
      };

      const result = await submitApplication(payload);

      setSuccessInfo({
        message: result.message || 'Application submitted successfully!',
        applicationId: result.applicationId || result.application?._id,
      });

      // Clear input fields
      setFormData({
        studentName: '',
        email: '',
        rollNumber: '',
      });

      if (onApplicationSuccess) {
        onApplicationSuccess(result);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="form-card" aria-labelledby="form-heading">
      <h2 id="form-heading" className="form-title">
        Apply for this Position
      </h2>
      <p className="form-subtitle">
        Fill out your details below to submit your application for <strong>{internship.title}</strong>.
      </p>

      {errorMessage && (
        <div className="alert alert-error" role="alert">
          <span className="alert-icon">⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {successInfo && (
        <div className="alert alert-success" role="status">
          <div className="success-header">
            <span className="alert-icon">✅</span>
            <strong>{successInfo.message}</strong>
          </div>
          {successInfo.applicationId && (
            <p className="success-meta">
              Saved Application ID: <code>{successInfo.applicationId}</code>
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="application-form">
        <div className="form-group">
          <label htmlFor="selectedInternship">Selected Internship</label>
          <input
            id="selectedInternship"
            type="text"
            value={`${internship.title} — ${internship.company}`}
            readOnly
            className="input-readonly"
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="studentName">
            Student Full Name <span className="required">*</span>
          </label>
          <input
            id="studentName"
            name="studentName"
            type="text"
            placeholder="e.g. Shankar Prakasam"
            value={formData.studentName}
            onChange={handleChange}
            className={formErrors.studentName ? 'input-error' : ''}
            required
            autoComplete="name"
          />
          {formErrors.studentName && (
            <span className="field-error">{formErrors.studentName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email Address <span className="required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="e.g. shankar@example.com"
            value={formData.email}
            onChange={handleChange}
            className={formErrors.email ? 'input-error' : ''}
            required
            autoComplete="email"
          />
          {formErrors.email && (
            <span className="field-error">{formErrors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="rollNumber">
            Roll / Student ID Number <span className="required">*</span>
          </label>
          <input
            id="rollNumber"
            name="rollNumber"
            type="text"
            placeholder="e.g. 24BCS259"
            value={formData.rollNumber}
            onChange={handleChange}
            className={formErrors.rollNumber ? 'input-error' : ''}
            required
          />
          {formErrors.rollNumber && (
            <span className="field-error">{formErrors.rollNumber}</span>
          )}
        </div>

        <button
          type="submit"
          className="button primary submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting Application...' : 'Submit Application →'}
        </button>
      </form>
    </section>
  );
}
