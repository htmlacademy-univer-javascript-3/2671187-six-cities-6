import { createSlice } from '@reduxjs/toolkit';
import {
  fetchOfferDetails,
  fetchNearbyOffers,
  fetchComments,
  submitComment,
} from '../api-actions';

interface OfferDetailsState {
  currentOffer: OfferDetails | null;
  nearbyOffers: Offer[];
  comments: Review[];
  isOfferLoading: boolean;
  isCommentSubmitting: boolean;
}

const initialState: OfferDetailsState = {
  currentOffer: null,
  nearbyOffers: [],
  comments: [],
  isOfferLoading: false,
  isCommentSubmitting: false,
};

const offerDetailsSlice = createSlice({
  name: 'offerDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfferDetails.pending, (state) => {
        state.isOfferLoading = true;
        state.currentOffer = null;
      })
      .addCase(fetchOfferDetails.fulfilled, (state, action) => {
        state.isOfferLoading = false;
        state.currentOffer = action.payload;
      })
      .addCase(fetchOfferDetails.rejected, (state) => {
        state.isOfferLoading = false;
        state.currentOffer = null;
      })
      .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.comments = [];
      })
      .addCase(submitComment.pending, (state) => {
        state.isCommentSubmitting = true;
      })
      .addCase(submitComment.fulfilled, (state, action) => {
        state.isCommentSubmitting = false;
        state.comments.push(action.payload);
      })
      .addCase(submitComment.rejected, (state) => {
        state.isCommentSubmitting = false;
      });
  },
});

export default offerDetailsSlice.reducer;

