import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAuthorById, getMemeComments, getMemes } from '../../api';

export type Author = {
  id: string;
  username: string;
  pictureUrl: string;
};

export type Text = {
  content: string;
  x: number;
  y: number;
};

export type Comment = {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
};

export type MemesState = {
  memes: {
    id: string;
    description: string;
    pictureUrl: string;
    author: Author;
    texts: Text[];
    createdAt: string;
    comments: Comment[];
    commentsCount: string;
  }[]
  isFetching: boolean;
  total: number;
  pageSize: number;
};

const initialState: MemesState = {
  memes: [],
  total: 0,
  pageSize: 0,
  isFetching: false,
};

export const fetchMemes = createAsyncThunk(
  'memes/fetchMemes',
  async ({ token, page }: { token: string, page: number }, { rejectWithValue }) => {
    try {
      const memesResponse = await getMemes(token, page);

      const memesWithData: MemesState['memes'] = await Promise.all(
        memesResponse.results.map(async (meme) => {
          const author: Author = await getAuthorById(token, meme.authorId);
          const commentsResponse = await getMemeComments(token, meme.id, 1);
          
          const comments: Comment[] = await Promise.all(
            commentsResponse.results.map(async (comment) => {
              const author: Author = await getAuthorById(token, comment.authorId);
              return { ...comment, author };
            })
          );

          return {
            author,
            comments,
            commentsCount: commentsResponse.total.toString(),
            createdAt: meme.createdAt,
            id: meme.id,
            description: meme.description,
            pictureUrl: meme.pictureUrl,
            texts: meme.texts,
            isFetching: false,
          };
        })
      );

      return {
        results: memesWithData,
        total: memesResponse.total,
        pageSize: memesResponse.pageSize,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);



export const memesSlice = createSlice({
  name: 'memes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMemes.fulfilled, (state, action) => {
      state.memes = [...action.payload.results];
      state.total = action.payload.total;
      state.pageSize = action.payload.pageSize;
      state.isFetching = false;
    })
    .addCase(fetchMemes.pending, (state) => {
      state.isFetching = true;
    });
  }
});

export const memesReducer = memesSlice.reducer;
