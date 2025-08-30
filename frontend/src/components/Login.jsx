import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Input } from './Inputs';
import { authStyles as styles } from '../assets/dummystyle';
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const Login = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic Validation
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔄 Attempting login with:', {
        email: formData.email.trim().toLowerCase(),
        apiPath: API_PATHS.AUTH.LOGIN,
      });

      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log('✅ Login API call successful');
      console.log('📦 Full response:', response);

      const responseData = response.data;
      const token = responseData.token;

      console.log('🎫 Token extracted:', token ? `Yes (${token.substring(0, 10)}...)` : 'No');

      if (!token) {
        setError('Login failed - no authentication token received');
        setIsLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem('token', token);
      console.log('💾 Token stored in localStorage');

      // Construct user object from flat response
      const user = {
        _id: responseData._id,
        name: responseData.name,
        email: responseData.email,
        token: token,
      };

      if (user && user._id && user.name && user.email) {
        updateUser(user);
        console.log('👤 User context updated successfully');
      } else {
        console.warn('⚠️ Incomplete user data from response:', responseData);
      }

      // Reset form and navigate
      setFormData({ email: '', password: '' });
      console.log('🧹 Form cleared');
      navigate('/dashboard', { replace: true });
      console.log('✅ Navigation command executed');
    } catch (error) {
      console.error('❌ Login error:', error);

      let errorMessage = 'Login failed. Please try again.';

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
          case 400:
            errorMessage = data?.message || 'Invalid email or password';
            break;
          case 401:
            errorMessage = 'Invalid credentials. Please check your email and password.';
            break;
          case 403:
            errorMessage = 'Access denied. Please contact support.';
            break;
          case 404:
            errorMessage = 'Login service not found. Try again later.';
            break;
          case 422:
            errorMessage = data?.message || 'Invalid input data';
            break;
          case 429:
            errorMessage = 'Too many login attempts. Try again later.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = data?.message || `Login failed (${status})`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Check your internet connection.';
      } else {
        errorMessage = error.message || 'An unexpected error occurred.';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin(e);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.title}>Welcome Back</h3>
        <p className={styles.subtitle}>Sign in to continue building amazing resumes</p>
      </div>

      <form onSubmit={handleLogin} className={styles.form} noValidate>
        <Input
          name="email"
          value={formData.email}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          label="Email"
          placeholder="your@email.com"
          type="email"
          autoComplete="username"
          required
          disabled={isLoading}
        />

        <Input
          name="password"
          value={formData.password}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          label="Password"
          placeholder="Enter your password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isLoading}
        />

        {error && (
          <div className={styles.errorMessage} role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading || !formData.email || !formData.password}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <p className={styles.switchText}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => setCurrentPage('signup')}
            className={styles.switchButton}
            disabled={isLoading}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;