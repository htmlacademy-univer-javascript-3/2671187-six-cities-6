import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchOffers,
  fetchOfferDetails,
  fetchNearbyOffers,
  fetchComments,
  submitComment,
} from './api-actions';

interface AppState {
  cityTab: City;
  offers: Offer[];
  sorting: SortingType;
  isLoading: boolean;
  error: string | null;
  authorizationStatus: AuthorizationStatus;
  user: AuthInfo | null;
  currentOffer: OfferDetails | null;
  nearbyOffers: Offer[];
  comments: Review[];
  isOfferLoading: boolean;
  isCommentSubmitting: boolean;
}

const initialState: AppState = {
  cityTab: 'Paris',
  offers: [],
  sorting: 'popular',
  isLoading: false,
  error: null,
  authorizationStatus: 'UNKNOWN',
  user: null,
  currentOffer: null,
  nearbyOffers: [],
  comments: [],
  isOfferLoading: false,
  isCommentSubmitting: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeCity: (state, action: PayloadAction<City>) => {
      state.cityTab = action.payload;
    },
    setOffers: (state, action: PayloadAction<Offer[]>) => {
      state.offers = action.payload;
    },
    changeSorting: (state, action: PayloadAction<SortingType>) => {
      state.sorting = action.payload;
    },
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
      .addCase(fetchOffers.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load offers';
      })
      .addCase(fetchOfferDetails.pending, state => {
        state.isOfferLoading = true;
        state.currentOffer = null;
      })
      .addCase(fetchOfferDetails.fulfilled, (state, action) => {
        state.isOfferLoading = false;
        state.currentOffer = action.payload;
      })
      .addCase(fetchOfferDetails.rejected, state => {
        state.isOfferLoading = false;
        state.currentOffer = null;
      })
      .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, state => {
        state.comments = [];
      })
      .addCase(submitComment.pending, state => {
        state.isCommentSubmitting = true;
      })
      .addCase(submitComment.fulfilled, (state, action) => {
        state.isCommentSubmitting = false;
        state.comments.push(action.payload);
      })
      .addCase(submitComment.rejected, state => {
        state.isCommentSubmitting = false;
      });
  },
});

export const {
  changeCity,
  setOffers,
  changeSorting,
  setAuthStatus,
  setUser,
  logout,
} = appSlice.actions;
export const reducer = appSlice.reducer;
