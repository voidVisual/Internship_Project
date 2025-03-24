import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io(process.env.REACT_APP_API_URL, {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Task-related events
  subscribeToTask(taskId, callback) {
    if (!this.socket) return;
    this.socket.emit('join-task', taskId);
    this.socket.on(`task-${taskId}-update`, callback);
  }

  unsubscribeFromTask(taskId) {
    if (!this.socket) return;
    this.socket.off(`task-${taskId}-update`);
    this.socket.emit('leave-task', taskId);
  }

  // Notification events
  subscribeToNotifications(userId, callback) {
    if (!this.socket) return;
    this.socket.on(`notification-${userId}`, callback);
  }

  // Comment events
  subscribeToComments(taskId, callback) {
    if (!this.socket) return;
    this.socket.on(`comment-${taskId}`, callback);
  }

  // User presence
  updateUserPresence(status) {
    if (!this.socket) return;
    this.socket.emit('user-presence', status);
  }
}

export default new SocketService();
