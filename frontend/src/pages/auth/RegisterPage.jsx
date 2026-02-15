import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
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
  // Real-time validation
  useEffect(() => {
    const newErrors = {};
    if (touched.username && formData.username) {
      if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = 'Username can only contain letters, numbers, and underscores';
      }
    }
    if (touched.email && formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    if (touched.password && formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one special character';
      }
    }
    if (touched.password_confirm && formData.password_confirm) {
      if (formData.password !== formData.password_confirm) {
        newErrors.password_confirm = 'Passwords do not match';
      }
    }
    setErrors(newErrors);
  }, [formData, touched]);
  const isFormValid = () => {
    return (
      formData.username.length >= 3 &&
      formData.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.password.length >= 8 &&
      /(?=.*[a-z])/.test(formData.password) &&
      /(?=.*[A-Z])/.test(formData.password) &&
      /(?=.*\d)/.test(formData.password) &&
      /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(formData.password) &&
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
      const errorMsg = typeof result.error === 'object'
        ? Object.values(result.error).flat().join(', ')
        : result.error;
      setServerError(errorMsg);
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[rgb(var(--color-bg))]">
      {loading && <LoadingSpinner />}
      <div className="w-full max-w-2xl bg-[rgb(var(--color-bg-secondary))] rounded-2xl shadow-xl p-8 border border-[rgb(var(--color-border))]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[rgb(var(--color-text))] mb-2">Create account</h1>
          <p className="text-[rgb(var(--color-text-secondary))]">Start building your knowledge network</p>
        </div>
        {serverError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm" role="alert" aria-live="assertive">
            {serverError}
          </div>
        )}
        <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-[rgb(var(--color-border))] rounded-lg font-medium text-[rgb(var(--color-text))] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled aria-label="Sign up with Google (Coming soon)">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
            <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
            <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49L4.405 11.9z" fill="#FBBC05"/>
            <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
          </svg>
          Continue with Google (Coming soon)
        </button>
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[rgb(var(--color-border))]"></div>
          <span className="text-sm text-[rgb(var(--color-text-muted))]">or</span>
          <div className="flex-1 h-px bg-[rgb(var(--color-border))]"></div>
        </div>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[rgb(var(--color-text))] mb-2">
                Username *
              </label>
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
                className={`input-field ${errors.username && touched.username ? 'input-error' : ''}`}
                aria-required="true"
                aria-invalid={errors.username && touched.username ? 'true' : 'false'}
                aria-describedby={errors.username && touched.username ? 'username-error' : undefined}
              />
              {errors.username && touched.username && (
                <span className="block mt-1 text-xs text-red-500" id="username-error" role="alert">{errors.username}</span>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--color-text))] mb-2">
                Email *
              </label>
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
                className={`input-field ${errors.email && touched.email ? 'input-error' : ''}`}
                aria-required="true"
                aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
              />
              {errors.email && touched.email && (
                <span className="block mt-1 text-xs text-red-500" id="email-error" role="alert">{errors.email}</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-[rgb(var(--color-text))] mb-2">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                autoComplete="given-name"
                placeholder="John"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-[rgb(var(--color-text))] mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                autoComplete="family-name"
                placeholder="Doe"
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[rgb(var(--color-text))] mb-2">
              Password *
            </label>
            <div className="relative">
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
                className={`input-field pr-12 ${errors.password && touched.password ? 'input-error' : ''}`}
                aria-required="true"
                aria-invalid={errors.password && touched.password ? 'true' : 'false'}
                aria-describedby={errors.password && touched.password ? 'password-error' : (!errors.password && touched.password && formData.password ? 'password-success' : undefined)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors"
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
              <span className="block mt-1 text-xs text-red-500" id="password-error" role="alert">{errors.password}</span>
            )}
            {!errors.password && touched.password && formData.password && (
              <span className="block mt-1 text-xs text-green-500" id="password-success" role="status">✓ Password is strong</span>
            )}
          </div>
          <div>
            <label htmlFor="password_confirm" className="block text-sm font-medium text-[rgb(var(--color-text))] mb-2">
              Confirm Password *
            </label>
            <div className="relative">
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
                className={`input-field pr-12 ${errors.password_confirm && touched.password_confirm ? 'input-error' : ''}`}
                aria-required="true"
                aria-invalid={errors.password_confirm && touched.password_confirm ? 'true' : 'false'}
                aria-describedby={errors.password_confirm && touched.password_confirm ? 'password-confirm-error' : (!errors.password_confirm && touched.password_confirm && formData.password_confirm && formData.password === formData.password_confirm ? 'password-confirm-success' : undefined)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors"
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
              <span className="block mt-1 text-xs text-red-500" id="password-confirm-error" role="alert">{errors.password_confirm}</span>
            )}
            {!errors.password_confirm && touched.password_confirm && formData.password_confirm && formData.password === formData.password_confirm && (
              <span className="block mt-1 text-xs text-green-500" id="password-confirm-success" role="status">✓ Passwords match</span>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary w-full mt-6"
            disabled={loading || !isFormValid()}
            aria-busy={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-[rgb(var(--color-text-secondary))]">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-500 hover:text-cyan-600 font-medium transition-colors">
              Sign in
            </Link>
          </p>
          <Link to="/" className="inline-block text-sm text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
