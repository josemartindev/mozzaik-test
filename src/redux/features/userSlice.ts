import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { getUserById } from '../../api';

export type UserState = {
  id: string;
  username: string;
  pictureUrl: string;
};

const initialState: UserState = {
  id: '',
  username: '',
  pictureUrl: '',
};

export const getUserByIdentification = createAsyncThunk(
  'memes/fetchMemes',
  async ({ token }: { token: string }, { rejectWithValue }) => {
  try {
    const user = await getUserById(token, jwtDecode<{ id: string }>(token).id);
    return user;
  } catch (error) {
    return rejectWithValue(error);
  }
});



export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserByIdentification.fulfilled, (state, action) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.pictureUrl = action.payload.pictureUrl;
    });
  }
});

export const userReducer = userSlice.reducer;

