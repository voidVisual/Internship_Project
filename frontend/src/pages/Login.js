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
} from '@mui/icons-material';
import { login } from '../store/slices/authSlice';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await dispatch(login(formData)).unwrap();
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Grid container sx={{ height: '100vh' }}>
        {/* Left side - Login Form */}
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
              Welcome Back!
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 3 }}>
              Please sign in to continue
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: '100%' }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                  },
                }}
              >
                Sign In
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  Don't have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                      fontWeight: 600,
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right side - Illustration */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?productivity)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              textAlign: 'center',
              p: 4,
            }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              Task Management
            </Typography>
            <Typography
              variant="h6"
              sx={{
                maxWidth: 400,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              Streamline your workflow, collaborate with your team, and achieve
              more together.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Login;
