import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  Comment as CommentIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import socketService from '../services/socketService';

function NotificationSystem() {
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (user?._id) {
      // Subscribe to notifications
      socketService.subscribeToNotifications(user._id, handleNewNotification);

      // Load existing notifications
      fetchNotifications();
    }
  }, [user?._id]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleNewNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task':
        return <AssignmentIcon />;
      case 'comment':
        return <CommentIcon />;
      case 'deadline':
        return <AccessTimeIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <MenuItem
                key={notification._id}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification._id);
                  }
                  handleClose();
                  // Handle navigation if needed
                }}
                sx={{
                  backgroundColor: notification.read ? 'inherit' : 'action.hover',
                }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={notification.message}
                  secondary={getTimeAgo(notification.createdAt)}
                />
              </MenuItem>
            ))
          )}
        </List>
      </Menu>
    </>
  );
}

export default NotificationSystem;
