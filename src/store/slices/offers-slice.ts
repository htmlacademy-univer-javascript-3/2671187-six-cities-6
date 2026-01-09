import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchOffers, changeFavoriteStatus } from '../api-actions';
import { logout } from './auth-slice';

interface OffersState {
  cityTab: City;
  offers: Offer[];
  sorting: SortingType;
  isLoading: boolean;
  error: string | null;
}

const initialState: OffersState = {
  cityTab: 'Paris',
  offers: [],
  sorting: 'popular',
  isLoading: false,
  error: null,
};

const offersSlice = createSlice({
  name: 'offers',
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
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOffers.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load offers';
      })
      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        const offer = state.offers.find(
          o => o.id.toString() === updatedOffer.id.toString()
        );
        if (offer) {
          offer.isFavorite = updatedOffer.isFavorite;
        }
      })
      .addCase(logout, state => {
        // Reset all isFavorite fields to false when user logs out
        state.offers.forEach(offer => {
          offer.isFavorite = false;
        });
      });
  },
});

export const { changeCity, setOffers, changeSorting } = offersSlice.actions;
export default offersSlice.reducer;
