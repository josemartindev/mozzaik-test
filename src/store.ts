// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './redux/features/authenticationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // Add the counter slice reducer
  },
});

export default store;
