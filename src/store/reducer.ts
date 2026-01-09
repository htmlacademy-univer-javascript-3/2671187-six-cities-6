import { combineReducers } from '@reduxjs/toolkit';
import offersReducer from './slices/offers-slice';
import authReducer from './slices/auth-slice';
import offerDetailsReducer from './slices/offer-details-slice';
import favoritesReducer from './slices/favorites-slice';

export const reducer = combineReducers({
  offers: offersReducer,
  auth: authReducer,
  offerDetails: offerDetailsReducer,
  favorites: favoritesReducer,
});
