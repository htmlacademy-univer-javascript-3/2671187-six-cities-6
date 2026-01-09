import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoritesList from '../components/favorites-list';
import Header from '../components/header';
import { useAppSelector, useAppDispatch } from '../store';
import { fetchFavorites } from '../store/api-actions';
import { selectFavorites } from '../store/selectors';

const FavoritesPage: FC = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const hasFavorites = favorites.length > 0;

  return (
    <div className='page'>
      <Header />

      <main className='page__main page__main--favorites'>
        <div className='page__favorites-container container'>
          <section className='favorites'>
            <h1 className='favorites__title'>Saved listing</h1>
            {hasFavorites ? (
              <FavoritesList favorites={favorites} />
            ) : (
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
