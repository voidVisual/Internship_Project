import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addComment, uploadAttachmentAsync } from '../store/slices/taskSlice';

function TaskDetail({ task, open, onClose }) {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      dispatch(addComment({ taskId: task._id, content: comment }));
      setComment('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(uploadAttachmentAsync({ taskId: task._id, attachment: file }));
    }
  };

  if (!task) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{task.title}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {task.description}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={1} mb={2}>
              <Chip
                label={task.status}
                color={
                  task.status === 'completed'
                    ? 'success'
                    : task.status === 'in-progress'
                    ? 'primary'
                    : 'default'
                }
              />
              <Chip
                label={task.priority}
                color={
                  task.priority === 'high'
                    ? 'error'
                    : task.priority === 'medium'
                    ? 'warning'
                    : 'success'
                }
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Assigned To
            </Typography>
            <Box display="flex" gap={1}>
              {task.assignedTo?.map((user) => (
                <Chip
                  key={user._id}
                  avatar={<Avatar>{user.name[0]}</Avatar>}
                  label={user.name}
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>

          {task.attachments && task.attachments.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Attachments
              </Typography>
              <List>
                {task.attachments.map((attachment, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" size="small">
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <AttachFileIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={attachment.name}
                      secondary={attachment.uploadedAt}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Comments
            </Typography>
            <List>
              {task.comments?.map((comment, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>{comment.user.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          component="span"
                          variant="subtitle2"
                          color="text.primary"
                        >
                          {comment.user.name}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {comment.content}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            {new Date(comment.createdAt).toLocaleString()}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < task.comments.length - 1 && <Divider variant="inset" />}
                </React.Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, flexDirection: 'column', gap: 2 }}>
        <Box display="flex" gap={2} width="100%">
          <Button
            component="label"
            variant="outlined"
            startIcon={<AttachFileIcon />}
          >
            Add Attachment
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        </Box>
        <Box
          component="form"
          onSubmit={handleCommentSubmit}
          display="flex"
          gap={1}
          width="100%"
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!comment.trim()}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default TaskDetail;
