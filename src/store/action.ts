import { changeCity, setOffers, changeSorting } from './slices/offers-slice';
import { setAuthStatus, setUser, logout } from './slices/auth-slice';

export const actions = {
  changeCity,
  setOffers,
  changeSorting,
  setAuthStatus,
  setUser,
  logout,
};

export { changeCity, setOffers, changeSorting, setAuthStatus, setUser, logout };
