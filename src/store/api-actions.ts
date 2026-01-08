import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { setOffers, setAuthStatus, setUser } from './reducer';
import { AppDispatch, RootState } from './index';

export const fetchOffers = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>('offers/fetchOffers', async (_arg, { dispatch, extra: api }) => {
  const { data } = await api.get<Offer[]>('/offers');

  dispatch(setOffers(data));
});

export const checkAuth = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>('user/checkAuth', async (_arg, { dispatch, extra: api }) => {
  try {
    const { data } = await api.get<AuthInfo>('/login');
    dispatch(setUser(data));
    dispatch(setAuthStatus('AUTH'));
  } catch {
    dispatch(setAuthStatus('NO_AUTH'));
  }
});

export const login = createAsyncThunk<
  AuthInfo,
  { email: string; password: string },
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>('user/login', async ({ email, password }, { dispatch, extra: api }) => {
  const { data } = await api.post<AuthInfo>('/login', { email, password });
  localStorage.setItem('token', data.token);
  dispatch(setUser(data));
  dispatch(setAuthStatus('AUTH'));
  return data;
});
