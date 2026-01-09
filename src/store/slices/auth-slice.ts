import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { checkAuth, login } from '../api-actions';

interface AuthState {
  authorizationStatus: AuthorizationStatus;
  user: AuthInfo | null;
}

const initialState: AuthState = {
  authorizationStatus: 'UNKNOWN',
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthStatus: (state, action: PayloadAction<AuthorizationStatus>) => {
      state.authorizationStatus = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthInfo | null>) => {
      state.user = action.payload;
    },
    logout: state => {
      state.authorizationStatus = 'NO_AUTH';
      state.user = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(checkAuth.fulfilled, state => {
        state.authorizationStatus = 'AUTH';
      })
      .addCase(checkAuth.rejected, state => {
        state.authorizationStatus = 'NO_AUTH';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authorizationStatus = 'AUTH';
        state.user = action.payload;
      });
  },
});

export const { setAuthStatus, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
