import { FC, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MainPage from './pages/main-page';
import LoginPage from './pages/login-page';
import FavoritesPage from './pages/favorites-page';
import OfferPage from './pages/offer-page';
import NotFoundPage from './pages/not-found-page';
import PrivateRoute from './components/private-route';
import { checkAuth } from './store/api-actions';
import type { AppDispatch, RootState } from './store';

const AppContent: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authorizationStatus = useSelector(
    (state: RootState) => state.authorizationStatus
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const isAuthorized = authorizationStatus === 'AUTH';

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route
          path='/login'
          element={isAuthorized ? <Navigate to='/' replace /> : <LoginPage />}
        />
        <Route
          path='/favorites'
          element={
            <PrivateRoute>
              <FavoritesPage favorites={[]} />
            </PrivateRoute>
          }
        />
        <Route path='/offer/:id' element={<OfferPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const App: FC = () => <AppContent />;

export default App;
