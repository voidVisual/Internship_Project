import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const { tasks } = useSelector((state) => state.tasks);

  const getTaskStats = () => {
    return {
      total: tasks.length,
      todo: tasks.filter(task => task.status === 'todo').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length,
      completed: tasks.filter(task => task.status === 'completed').length
    };
  };

  const stats = getTaskStats();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: 'primary.main',
              color: 'white'
            }}
          >
            <Typography variant="h6">Total Tasks</Typography>
            <Typography variant="h3">{stats.total}</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: '#ff9800',
              color: 'white'
            }}
          >
            <Typography variant="h6">To Do</Typography>
            <Typography variant="h3">{stats.todo}</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: '#2196f3',
              color: 'white'
            }}
          >
            <Typography variant="h6">In Progress</Typography>
            <Typography variant="h3">{stats.inProgress}</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: '#4caf50',
              color: 'white'
            }}
          >
            <Typography variant="h6">Completed</Typography>
            <Typography variant="h3">{stats.completed}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
