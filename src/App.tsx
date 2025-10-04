import { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import FavoritesPage from './pages/FavoritesPage';
import OfferPage from './pages/OfferPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';

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
