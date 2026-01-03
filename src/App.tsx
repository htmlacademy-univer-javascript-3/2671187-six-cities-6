import { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/main-page';
import LoginPage from './pages/login-page';
import FavoritesPage from './pages/favorites-page';
import OfferPage from './pages/offer-page';
import NotFoundPage from './pages/not-found-page';
import PrivateRoute from './components/private-route';

interface AppProps {
  placesCount: number;
}

const App: FC<AppProps> = ({ placesCount }) => {
  const isAuthorized = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage placesCount={placesCount} />} />
        <Route
          path='/login'
          element={isAuthorized ? <Navigate to='/' replace /> : <LoginPage />}
        />
        <Route
          path='/favorites'
          element={
            <PrivateRoute isAuthorized={isAuthorized}>
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

export default App;
