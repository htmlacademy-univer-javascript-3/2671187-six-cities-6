import { FC, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import FavoritesList from '../components/favorites-list/favorites-list';
import Header from '../components/header';
import NetworkError from '../components/network-error';
import { useAppSelector, useAppDispatch } from '../store';
import { fetchFavorites } from '../store/api-actions';
import {
  selectFavorites,
  selectFavoritesIsLoading,
  selectFavoritesError,
} from '../store/selectors';

const FavoritesPage: FC = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);
  const isLoading = useAppSelector(selectFavoritesIsLoading);
  const error = useAppSelector(selectFavoritesError);

  const handleRetryFavorites = useCallback(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFavorites())
      .unwrap()
      .catch(() => {
        // Ошибка уже в favoritesSlice
      });
  }, [dispatch]);

  const hasFavorites = favorites.length > 0;

  return (
    <div className='page'>
      <Header />

      <main className='page__main page__main--favorites'>
        <div className='page__favorites-container container'>
          <section className='favorites'>
            <h1 className='favorites__title'>Saved listing</h1>
            {isLoading && (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                Loading your favorite offers...
              </div>
            )}
            {!isLoading && error && (
              <NetworkError
                handleClick={handleRetryFavorites}
                loadables='favorites'
                error={error}
              />
            )}
            {!isLoading && !error && hasFavorites && (
              <FavoritesList favorites={favorites} />
            )}
            {!isLoading && !error && !hasFavorites && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>You have no favorite offers yet.</p>
                <Link to='/'>Go back to main page</Link>
              </div>
            )}
          </section>
        </div>
      </main>
      <footer className='footer container'>
        <Link className='footer__logo-link' to='/'>
          <img
            className='footer__logo'
            src='/img/logo.svg'
            alt='6 cities logo'
            width='64'
            height='33'
          />
        </Link>
      </footer>
    </div>
  );
};

export default FavoritesPage;
