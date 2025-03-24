import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  Dialog,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  AvatarGroup,
  Tooltip,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/slices/taskSlice';
import TaskDetail from '../components/TaskDetail';
import socketService from '../services/socketService';

const TASK_STATUS = [
  { id: 'todo', label: 'To Do', color: '#ff9f43', icon: '📋' },
  { id: 'in-progress', label: 'In Progress', color: '#2196f3', icon: '🔄' },
  { id: 'review', label: 'Review', color: '#9c27b0', icon: '👀' },
  { id: 'completed', label: 'Completed', color: '#4caf50', icon: '✅' }
];

const PRIORITY_COLORS = {
  low: { color: '#4caf50', label: 'Low Priority', icon: '⬇️' },
  medium: { color: '#ff9800', label: 'Medium Priority', icon: '➡️' },
  high: { color: '#f44336', label: 'High Priority', icon: '⬆️' }
};

function TaskBoard() {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    assignedTo: [],
    deadline: '',
  });

  useEffect(() => {
    dispatch(fetchTasks());
    
    // Subscribe to real-time updates
    socketService.connect(localStorage.getItem('token'));

    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    
    dispatch(updateTask({
      taskId,
      updates: { status: newStatus }
    }));
  };

  const handleOpenDialog = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo?.map(user => user._id) || [],
        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        assignedTo: [],
        deadline: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      assignedTo: [],
      deadline: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      dispatch(updateTask({
        taskId: editingTask._id,
        updates: taskForm,
      }));
    } else {
      dispatch(createTask(taskForm));
    }
    handleCloseDialog();
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId));
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const canEditTask = user?.role === 'admin' || user?.role === 'editor';

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          borderRadius: 2,
          p: 3,
          color: 'white',
          boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Task Board
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
            Manage and track your team's progress
          </Typography>
        </Box>
        {canEditTask && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Add Task
          </Button>
        )}
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={3}>
          {TASK_STATUS.map((status) => (
            <Grid item xs={12} sm={6} md={3} key={status.id}>
              <Paper
                sx={{
                  height: '100%',
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    background: `linear-gradient(45deg, ${status.color} 30%, ${status.color}dd 90%)`,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                    {status.icon} {status.label}
                  </Typography>
                  <Chip
                    label={tasks.filter(task => task.status === status.id).length}
                    size="small"
                    sx={{
                      ml: 'auto',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                    }}
                  />
                </Box>
                <Droppable droppableId={status.id}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        p: 2,
                        minHeight: 500,
                        backgroundColor: 'rgba(0,0,0,0.02)',
                      }}
                    >
                      {tasks
                        .filter((task) => task.status === status.id)
                        .map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                            isDragDisabled={!canEditTask}
                          >
                            {(provided, snapshot) => (
                              <Paper
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  mb: 2,
                                  p: 2,
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  transform: snapshot.isDragging
                                    ? 'scale(1.02)'
                                    : 'scale(1)',
                                  '&:hover': {
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                  },
                                }}
                                onClick={() => handleTaskClick(task)}
                                elevation={snapshot.isDragging ? 8 : 1}
                              >
                                <Box sx={{ mb: 2 }}>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontSize: '1rem',
                                      fontWeight: 600,
                                      mb: 1,
                                    }}
                                  >
                                    {task.title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{
                                      mb: 2,
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {task.description}
                                  </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                  <AvatarGroup
                                    max={3}
                                    sx={{
                                      '& .MuiAvatar-root': {
                                        width: 28,
                                        height: 28,
                                        fontSize: '0.875rem',
                                      },
                                    }}
                                  >
                                    {task.assignedTo?.map((user) => (
                                      <Tooltip
                                        key={user._id}
                                        title={user.name}
                                        arrow
                                      >
                                        <Avatar
                                          sx={{
                                            bgcolor: `${PRIORITY_COLORS[task.priority].color}22`,
                                            color: PRIORITY_COLORS[task.priority].color,
                                          }}
                                        >
                                          {user.name.charAt(0)}
                                        </Avatar>
                                      </Tooltip>
                                    ))}
                                  </AvatarGroup>
                                </Box>

                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Chip
                                      icon={
                                        <Box component="span" sx={{ mr: -0.5 }}>
                                          {PRIORITY_COLORS[task.priority].icon}
                                        </Box>
                                      }
                                      label={task.priority}
                                      size="small"
                                      sx={{
                                        backgroundColor: `${PRIORITY_COLORS[task.priority].color}22`,
                                        color: PRIORITY_COLORS[task.priority].color,
                                        fontWeight: 600,
                                      }}
                                    />
                                    {task.comments?.length > 0 && (
                                      <Chip
                                        icon={<CommentIcon sx={{ fontSize: 16 }} />}
                                        label={task.comments.length}
                                        size="small"
                                        sx={{
                                          backgroundColor: 'action.selected',
                                        }}
                                      />
                                    )}
                                    {task.attachments?.length > 0 && (
                                      <Chip
                                        icon={<AttachFileIcon sx={{ fontSize: 16 }} />}
                                        label={task.attachments.length}
                                        size="small"
                                        sx={{
                                          backgroundColor: 'action.selected',
                                        }}
                                      />
                                    )}
                                  </Box>
                                  {canEditTask && (
                                    <Box>
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenDialog(task);
                                        }}
                                        sx={{
                                          color: 'primary.main',
                                          '&:hover': {
                                            backgroundColor: 'primary.lighter',
                                          },
                                        }}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteTask(task._id);
                                        }}
                                        sx={{
                                          color: 'error.main',
                                          '&:hover': {
                                            backgroundColor: 'error.lighter',
                                          },
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  )}
                                </Box>
                              </Paper>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>

      {/* Task Creation/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editingTask ? 'Edit Task' : 'New Task'}
          </Typography>
          <TextField
            fullWidth
            label="Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deadline"
                type="date"
                value={taskForm.deadline}
                onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" type="submit">
              {editingTask ? 'Save' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Task Detail Dialog */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          open={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </Box>
  );
}

export default TaskBoard;
