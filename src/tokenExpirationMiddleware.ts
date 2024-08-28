import { Middleware } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { signout } from '../src/redux/features/authenticationSlice'; // Import your logout action

interface JwtPayload {
  exp: number;
}

export const tokenExpirationMiddleware: Middleware = (store) => (next) => (action) => {
  const token = store.getState().auth.token;

  if (token) {
    try {
      const decodedToken: JwtPayload = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        store.dispatch(signout());
        return;
      }
    } catch (error) {
      console.error('Error decoding JWT token:', error);
    }
  }

  return next(action);
};
