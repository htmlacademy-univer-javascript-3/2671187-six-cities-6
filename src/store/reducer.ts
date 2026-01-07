import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { offers } from '../mocks/offers';

interface AppState {
  city: City;
  offers: Offer[];
  sorting: SortingType;
}

const initialState: AppState = {
  city: 'Paris',
  offers,
  sorting: 'popular',
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
    changeSorting: (state, action: PayloadAction<SortingType>) => {
      state.sorting = action.payload;
    },
  },
});

export const { changeCity, setOffers, changeSorting } = appSlice.actions;
export const reducer = appSlice.reducer;
