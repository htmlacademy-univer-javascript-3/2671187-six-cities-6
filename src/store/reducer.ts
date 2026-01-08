import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchOffers } from './api-actions';

interface AppState {
  cityTab: City;
  offers: Offer[];
  sorting: SortingType;
  isLoading: boolean;
  error: string | null;
}

const initialState: AppState = {
  cityTab: 'Paris',
  offers: [],
  sorting: 'popular',
  isLoading: false,
  error: null,
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
      });
  },
});

export const { changeCity, setOffers, changeSorting } = appSlice.actions;
export const reducer = appSlice.reducer;
