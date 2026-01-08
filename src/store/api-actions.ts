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

type CommentData = {
  comment: string;
  rating: number;
};

export const fetchOfferDetails = createAsyncThunk<
  OfferDetails,
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>('offer/fetchDetails', async (offerId, { extra: api }) => {
  const { data } = await api.get<OfferDetails>(`/offers/${offerId}`);
  return data;
});

export const fetchNearbyOffers = createAsyncThunk<
  Offer[],
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>('offer/fetchNearby', async (offerId, { extra: api }) => {
  const { data } = await api.get<Offer[]>(`/offers/${offerId}/nearby`);
  return data;
});

export const fetchComments = createAsyncThunk<
  Review[],
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>('offer/fetchComments', async (offerId, { extra: api }) => {
  const { data } = await api.get<Review[]>(`/comments/${offerId}`);
  return data;
});

export const submitComment = createAsyncThunk<
  Review,
  { offerId: string; commentData: CommentData },
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>('offer/submitComment', async ({ offerId, commentData }, { extra: api }) => {
  const { data } = await api.post<Review>(`/comments/${offerId}`, commentData);
  return data;
});
