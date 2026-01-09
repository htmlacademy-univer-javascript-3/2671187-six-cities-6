import { FC, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/main-page';
import LoginPage from './pages/login-page';
import FavoritesPage from './pages/favorites-page';
import OfferPage from './pages/offer-page';
import NotFoundPage from './pages/not-found-page';
import PrivateRoute from './components/private-route/private-route';
import { checkAuth, fetchFavorites } from './store/api-actions';
import { useAppDispatch, useAppSelector } from './store';
import { selectAuthorizationStatus } from './store/selectors';

const AppContent: FC = () => {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (authorizationStatus === 'AUTH') {
      dispatch(fetchFavorites());
    }
  }, [authorizationStatus, dispatch]);

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
              <FavoritesPage />
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
