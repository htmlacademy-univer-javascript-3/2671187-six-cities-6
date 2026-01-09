import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FavoritesCard from '../favorites-card/favorites-card';
import { useAppDispatch } from '../../store';
import { changeCity } from '../../store/action';

interface FavoritesListProps {
  favorites: FavoriteOffer[];
}

const FavoritesList: FC<FavoritesListProps> = ({ favorites }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCityClick = useCallback(
    (city: string) => {
      dispatch(changeCity(city));
      navigate('/');
    },
    [dispatch, navigate]
  );
  const favoritesByCity = favorites.reduce(
    (acc, offer) => {
      if (!acc[offer.city]) {
        acc[offer.city] = [];
      }
      acc[offer.city].push(offer);
      return acc;
    },
    {} as Record<string, FavoriteOffer[]>
  );

  return (
    <ul className='favorites__list'>
      {Object.entries(favoritesByCity).map(([city, cityFavorites]) => (
        <li key={city} className='favorites__locations-items'>
          <div className='favorites__locations locations locations--current'>
            <div className='locations__item'>
              <button
                className='locations__item-link'
                type='button'
                onClick={() => handleCityClick(city)}
              >
                <span>{city}</span>
              </button>
            </div>
          </div>
          <div className='favorites__places'>
            {cityFavorites.map(offer => (
              <FavoritesCard key={offer.id} offer={offer} />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FavoritesList;
