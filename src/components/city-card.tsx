import { FC } from 'react';
import { Link } from 'react-router-dom';

interface CityCardProps {
  offer: Offer;
  setActiveOffer?: (offer: Offer | null) => void;
}

const CityCard: FC<CityCardProps> = ({ offer, setActiveOffer }) => {
  const handleMouseEnter = () => {
    if (setActiveOffer) {
      setActiveOffer(offer);
    }
  };

  const handleMouseLeave = () => {
    if (setActiveOffer) {
      setActiveOffer(null);
    }
  };

  return (
    <article
      className='cities__card place-card'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {offer.isPremium && (
        <div className='place-card__mark'>
          <span>Premium</span>
        </div>
      )}
      <div className='cities__image-wrapper place-card__image-wrapper'>
        <Link to={`/offer/${offer.id}`} aria-label={`View ${offer.title}`}>
          <img
            className='place-card__image'
            src={offer.image}
            width='260'
            height='200'
            alt={offer.title}
          />
        </Link>
      </div>
      <div className='place-card__info'>
        <div className='place-card__price-wrapper'>
          <div className='place-card__price'>
            <b className='place-card__price-value'>&euro;{offer.price}</b>
            <span className='place-card__price-text'>&#47;&nbsp;night</span>
          </div>
          <button
            className={`place-card__bookmark-button button ${
              offer.isBookmarked
                ? 'place-card__bookmark-button--active'
                : ''
            }`}
            type='button'
            aria-label={
              offer.isBookmarked
                ? 'Remove from bookmarks'
                : 'Add to bookmarks'
            }
          >
            <svg className='place-card__bookmark-icon' width='18' height='19'>
              <use xlinkHref='#icon-bookmark'></use>
            </svg>
            <span className='visually-hidden'>
              {offer.isBookmarked ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>
        <div className='place-card__rating rating'>
          <div className='place-card__stars rating__stars'>
            <span style={{ width: `${offer.ratingPercent}%` }}></span>
            <span className='visually-hidden'>Rating</span>
          </div>
        </div>
        <h2 className='place-card__name'>
          <Link to={`/offer/${offer.id}`} aria-label={`View ${offer.title}`}>
            {offer.title}
          </Link>
        </h2>
        <p className='place-card__type'>{offer.type}</p>
      </div>
    </article>
  );
};

export default CityCard;
