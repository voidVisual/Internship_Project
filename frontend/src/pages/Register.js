import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
  Alert,
  Container,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  TaskAlt as TaskIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { register } from '../store/slices/authSlice';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      // Remove confirmPassword before sending to the backend
      const { confirmPassword, ...registrationData } = formData;
      await dispatch(register(registrationData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.errors) {
        setError(err.response.data.errors[0]?.msg || 'Registration failed');
      } else {
        setError(err.message || 'Registration failed');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="lg">
      <Grid container sx={{ height: '100vh' }}>
        {/* Left side - Register Form */}
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          square
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <TaskIcon
                sx={{ fontSize: 40, color: 'primary.main', mr: 1 }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                }}
              >
                Zidio
              </Typography>
            </Box>
            <Typography component="h1" variant="h5" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Join us to start managing your tasks efficiently
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                SIGN UP
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Already have an account? Sign In
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>

        {/* Right side - Hero Image */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(/hero-image.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: { xs: 'none', sm: 'block' },
          }}
        />
      </Grid>
    </Container>
  );
}

export default Register;
