import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
} from '@mui/material';
import { updatePreferences } from '../store/slices/preferencesSlice';

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { darkMode, emailNotifications } = useSelector((state) => state.preferences);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePreferencesChange = async (preference) => {
    try {
      await dispatch(updatePreferences(preference)).unwrap();
      setMessage('Preferences updated successfully');
    } catch (err) {
      setError('Failed to update preferences');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      // Implement profile update logic here
      setMessage('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Box component="form" onSubmit={handleProfileUpdate}>
            <TextField
              fullWidth
              label="Name"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <Button variant="contained" type="submit">
              Update Profile
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <Box component="form" onSubmit={handleProfileUpdate}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={profileData.currentPassword}
              onChange={(e) =>
                setProfileData({ ...profileData, currentPassword: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={profileData.newPassword}
              onChange={(e) =>
                setProfileData({ ...profileData, newPassword: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={profileData.confirmPassword}
              onChange={(e) =>
                setProfileData({ ...profileData, confirmPassword: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <Button variant="contained" type="submit">
              Change Password
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Preferences
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => handlePreferencesChange({ darkMode: !darkMode })}
              />
            }
            label="Dark Mode"
          />
          <Divider sx={{ my: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={emailNotifications}
                onChange={() =>
                  handlePreferencesChange({
                    emailNotifications: !emailNotifications,
                  })
                }
              />
            }
            label="Email Notifications"
          />
        </CardContent>
      </Card>
    </Box>
  );
}

export default Profile;
