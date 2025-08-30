import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Input } from './Inputs';
import { authStyles as styles } from '../assets/dummystyle';
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const SignUp = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.signupTitle}>Create Account</h3>
        <p className={styles.signupSubtitle}>Join thousands of professionals today</p>
      </div>

      <form onSubmit={handleSignUp} className={styles.signupForm}>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          label="Full Name"
          placeholder="John Doe"
          type="text"
          autoComplete="name"
          required
        />

        <Input
          name="email"
          value={formData.email}
          onChange={handleChange}
          label="Email"
          placeholder="abc@email.com"
          type="email"
          autoComplete="email"
          required
        />

        <Input
          name="password"
          value={formData.password}
          onChange={handleChange}
          label="Password"
          placeholder="Min 8 characters"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button 
          type="submit" 
          className={styles.signupSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => setCurrentPage('login')}
            className={styles.signupSwitchButton}
            disabled={isLoading}
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;