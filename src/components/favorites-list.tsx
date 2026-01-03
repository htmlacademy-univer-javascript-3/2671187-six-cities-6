import { FC } from 'react';
import FavoritesCard from './favorites-card';

interface FavoritesListProps {
  favorites: FavoriteOffer[];
}

const FavoritesList: FC<FavoritesListProps> = ({ favorites }) => {
  const favoritesByCity = favorites.reduce((acc, offer) => {
    if (!acc[offer.city]) {
      acc[offer.city] = [];
    }
    acc[offer.city].push(offer);
    return acc;
  }, {} as Record<string, FavoriteOffer[]>);

  return (
    <ul className='favorites__list'>
      {Object.entries(favoritesByCity).map(([city, cityFavorites]) => (
        <li key={city} className='favorites__locations-items'>
          <div className='favorites__locations locations locations--current'>
            <div className='locations__item'>
              <a className='locations__item-link' href='#'>
                <span>{city}</span>
              </a>
            </div>
          </div>
          <div className='favorites__places'>
            {cityFavorites.map((offer) => (
              <FavoritesCard key={offer.id} offer={offer} />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FavoritesList;

