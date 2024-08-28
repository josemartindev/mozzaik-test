import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

export type AuthenticationState = {
  isAuthenticated: boolean;
  token: string;
  userId: string;
};

const initialState: AuthenticationState = {
  isAuthenticated: false,
  token: '',
  userId: '',
};

export const authenticationSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticate: (state, action) => {
      localStorage.setItem('token', action.payload);
      state.isAuthenticated = true;
      state.token = action.payload;
      state.userId = jwtDecode<{ id: string }>(action.payload).id
    },
    signout: (state) => {
      localStorage.removeItem('token');
      state.isAuthenticated = false;
      state.token = '';
      state.userId = '';
    },
  },
});

export const { authenticate, signout } = authenticationSlice.actions;

export default authenticationSlice.reducer;
