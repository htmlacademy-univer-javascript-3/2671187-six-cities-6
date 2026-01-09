import { createSlice } from '@reduxjs/toolkit';
import {
  fetchOfferDetails,
  fetchNearbyOffers,
  fetchComments,
  submitComment,
  changeFavoriteStatus,
} from '../api-actions';
import { logout } from './auth-slice';

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
  extraReducers: builder => {
    builder
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
      })
      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        if (
          state.currentOffer &&
          state.currentOffer.id.toString() === updatedOffer.id.toString()
        ) {
          state.currentOffer.isFavorite = updatedOffer.isFavorite;
        }
        // Also update isFavorite in nearbyOffers
        const nearbyOfferIndex = state.nearbyOffers.findIndex(
          offer => offer.id.toString() === updatedOffer.id.toString()
        );
        if (nearbyOfferIndex !== -1) {
          state.nearbyOffers[nearbyOfferIndex].isFavorite =
            updatedOffer.isFavorite;
        }
      })
      .addCase(logout, state => {
        // Reset isFavorite fields when user logs out
        if (state.currentOffer) {
          state.currentOffer.isFavorite = false;
        }
        state.nearbyOffers.forEach(offer => {
          offer.isFavorite = false;
        });
      });
  },
});

export default offerDetailsSlice.reducer;
