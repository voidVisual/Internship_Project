import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Alert,
} from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`${API_URL}/api/users/${userId}/role`, {
        role: newRole,
      });
      setMessage('User role updated successfully');
      fetchUsers();
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'editor':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      renderValue={(role) => (
                        <Chip
                          label={role}
                          size="small"
                          color={getRoleColor(role)}
                        />
                      )}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="editor">Editor</MenuItem>
                      <MenuItem value="viewer">Viewer</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default UserManagement;
