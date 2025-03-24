import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}/api/tasks?${params}`);
    return response.data;
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData) => {
    const response = await axios.post(`${API_URL}/api/tasks`, taskData);
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updates }) => {
    const response = await axios.patch(`${API_URL}/api/tasks/${taskId}`, updates);
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId) => {
    await axios.delete(`${API_URL}/api/tasks/${taskId}`);
    return taskId;
  }
);

export const addComment = createAsyncThunk(
  'tasks/addComment',
  async ({ taskId, content }) => {
    const response = await axios.post(`${API_URL}/api/tasks/${taskId}/comments`, { content });
    return { taskId, comment: response.data };
  }
);

export const uploadAttachmentAsync = createAsyncThunk(
  'tasks/uploadAttachment',
  async ({ taskId, attachment }) => {
    const formData = new FormData();
    formData.append('attachment', attachment);
    const response = await axios.post(`${API_URL}/api/tasks/${taskId}/attachments`, formData);
    return { taskId, attachment: response.data };
  }
);

const initialState = {
  tasks: [],
  filters: {},
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    updateTaskInState: (state, action) => {
      const index = state.tasks.findIndex(task => task._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { taskId, comment } = action.payload;
        const task = state.tasks.find(t => t._id === taskId);
        if (task) {
          if (!task.comments) task.comments = [];
          task.comments.push(comment);
        }
      })
      .addCase(uploadAttachmentAsync.fulfilled, (state, action) => {
        const { taskId, attachment } = action.payload;
        const task = state.tasks.find(t => t._id === taskId);
        if (task) {
          if (!task.attachments) task.attachments = [];
          task.attachments.push(attachment);
        }
      });
  },
});

export const {
  setFilters,
  clearFilters,
  updateTaskInState,
  clearErrors
} = taskSlice.actions;

export default taskSlice.reducer;
