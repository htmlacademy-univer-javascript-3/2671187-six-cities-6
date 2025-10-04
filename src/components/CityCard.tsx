import { FC } from 'react';

interface CityCardProps {
  mark?: string;
  image: string;
  price: string;
  rating: string;
  name: string;
  type: string;
  isBookmarked: boolean;
}

const CityCard: FC<CityCardProps> = ({
  mark,
  image,
  price,
  rating,
  name,
  type,
  isBookmarked,
}) => (
  <article className='cities__card place-card'>
    {mark && (
      <div className='place-card__mark'>
        <span>{mark}</span>
      </div>
    )}
    <div className='cities__image-wrapper place-card__image-wrapper'>
      <a href='#' aria-label={`View ${name}`}>
        <img
          className='place-card__image'
          src={image}
          width='260'
          height='200'
          alt={name}
        />
      </a>
    </div>
    <div className='place-card__info'>
      <div className='place-card__price-wrapper'>
        <div className='place-card__price'>
          <b className='place-card__price-value'>&euro;{price}</b>
          <span className='place-card__price-text'>&#47;&nbsp;night</span>
        </div>
        <button
          className={`place-card__bookmark-button button ${
            isBookmarked ? 'place-card__bookmark-button--active' : ''
          }`}
          type='button'
          aria-label={
            isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'
          }
        >
          <svg className='place-card__bookmark-icon' width='18' height='19'>
            <use xlinkHref='#icon-bookmark'></use>
          </svg>
          <span className='visually-hidden'>
            {isBookmarked ? 'In bookmarks' : 'To bookmarks'}
          </span>
        </button>
      </div>
      <div className='place-card__rating rating'>
        <div className='place-card__stars rating__stars'>
          <span style={{ width: `${rating}%` }}></span>
          <span className='visually-hidden'>Rating</span>
        </div>
      </div>
      <h2 className='place-card__name'>
        <a href='#' aria-label={`View ${name}`}>
          {name}
        </a>
      </h2>
      <p className='place-card__type'>{type}</p>
    </div>
  </article>
);

export default CityCard;
