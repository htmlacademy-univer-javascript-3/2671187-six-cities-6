import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { offers } from '../mocks/offers';

interface AppState {
  city: City;
  offers: Offer[];
}

const initialState: AppState = {
  city: 'Paris',
  offers,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeCity: (state, action: PayloadAction<City>) => {
      state.city = action.payload;
    },
    setOffers: (state, action: PayloadAction<Offer[]>) => {
      state.offers = action.payload;
    },
  },
});

export const { changeCity, setOffers } = appSlice.actions;
export const reducer = appSlice.reducer;
