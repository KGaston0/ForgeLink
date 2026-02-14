import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import './LoginPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // Validación en tiempo real
  useEffect(() => {
    const newErrors = {};

    // Validar username
    if (touched.username && formData.username) {
      if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = 'Username can only contain letters, numbers, and underscores';
      }
    }

    // Validar email
    if (touched.email && formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Validar password
    if (touched.password && formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one special character (!@#$%^&*...)';
      }
    }

    // Validar password confirmation
    if (touched.password_confirm && formData.password_confirm) {
      if (formData.password !== formData.password_confirm) {
        newErrors.password_confirm = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
  }, [formData, touched]);

  // Verificar si el formulario es válido
  const isFormValid = () => {
    return (
      formData.username.length >= 3 &&
      formData.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.password.length >= 8 &&
      /(?=.*[a-z])/.test(formData.password) &&
      /(?=.*[A-Z])/.test(formData.password) &&
      /(?=.*\d)/.test(formData.password) &&
      /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password) &&
      formData.password === formData.password_confirm &&
      Object.keys(errors).length === 0
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setServerError('');
  };

  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Marcar todos los campos como touched
    setTouched({
      username: true,
      email: true,
      password: true,
      password_confirm: true,
    });

    if (!isFormValid()) {
      return;
    }

    setLoading(true);
    setServerError('');

    const result = await register(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      // Handle error object or string
      const errorMsg = typeof result.error === 'object'
        ? Object.values(result.error).flat().join(', ')
        : result.error;
      setServerError(errorMsg);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      {loading && <LoadingSpinner />}
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create account</h1>
          <p>Start building your knowledge network</p>
        </div>

        {serverError && (
          <div className="auth-error" role="alert" aria-live="assertive">
            {serverError}
          </div>
        )}

        {/* Google Sign Up - Placeholder */}
        <button type="button" className="btn-google" disabled aria-label="Sign up with Google (Coming soon)">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
            <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
            <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49L4.405 11.9z" fill="#FBBC05"/>
            <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
          </svg>
          Continue with Google (Coming soon)
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={() => handleBlur('username')}
              required
              autoComplete="username"
              placeholder="Choose a username"
              className={errors.username && touched.username ? 'input-error' : ''}
              aria-required="true"
              aria-invalid={errors.username && touched.username ? 'true' : 'false'}
              aria-describedby={errors.username && touched.username ? 'username-error' : undefined}
            />
            {errors.username && touched.username && (
              <span className="field-error" id="username-error" role="alert">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              required
              autoComplete="email"
              placeholder="your@email.com"
              className={errors.email && touched.email ? 'input-error' : ''}
              aria-required="true"
              aria-invalid={errors.email && touched.email ? 'true' : 'false'}
              aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
            />
            {errors.email && touched.email && (
              <span className="field-error" id="email-error" role="alert">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              autoComplete="given-name"
              placeholder="John"
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              autoComplete="family-name"
              placeholder="Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                required
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                className={errors.password && touched.password ? 'input-error' : ''}
                aria-required="true"
                aria-invalid={errors.password && touched.password ? 'true' : 'false'}
                aria-describedby={errors.password && touched.password ? 'password-error' : (!errors.password && touched.password && formData.password ? 'password-success' : undefined)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && touched.password && (
              <span className="field-error" id="password-error" role="alert">{errors.password}</span>
            )}
            {!errors.password && touched.password && formData.password && (
              <span className="field-success" id="password-success" role="status">✓ Password is strong</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password_confirm">Confirm Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                id="password_confirm"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                onBlur={() => handleBlur('password_confirm')}
                required
                autoComplete="new-password"
                placeholder="Repeat your password"
                className={errors.password_confirm && touched.password_confirm ? 'input-error' : ''}
                aria-required="true"
                aria-invalid={errors.password_confirm && touched.password_confirm ? 'true' : 'false'}
                aria-describedby={errors.password_confirm && touched.password_confirm ? 'password-confirm-error' : (!errors.password_confirm && touched.password_confirm && formData.password_confirm && formData.password === formData.password_confirm ? 'password-confirm-success' : undefined)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                aria-label={showPasswordConfirm ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPasswordConfirm ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password_confirm && touched.password_confirm && (
              <span className="field-error" id="password-confirm-error" role="alert">{errors.password_confirm}</span>
            )}
            {!errors.password_confirm && touched.password_confirm && formData.password_confirm && formData.password === formData.password_confirm && (
              <span className="field-success" id="password-confirm-success" role="status">✓ Passwords match</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || !isFormValid()}
            aria-busy={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
          <Link to="/" className="auth-link-secondary">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}



