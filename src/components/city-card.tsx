import { FC, memo, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../store';
import { selectAuthorizationStatus } from '../store/selectors';
import { changeFavoriteStatus } from '../store/api-actions';
import { getWidthByRatingPercent } from '../utils/formatters';

interface CityCardProps {
  mark?: string;
  image: string;
  price: string;
  name: string;
  type: string;
  isBookmarked: boolean;
  onCardHover?: (offer: Offer | null) => void;
  offer?: Offer;
}

const CityCardComponent: FC<CityCardProps> = ({
  mark,
  image,
  price,
  name,
  type,
  isBookmarked,
  onCardHover,
  offer,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  // Мемоизируем вычисление класса для кнопки закладок
  const bookmarkButtonClassName = useMemo(
    () =>
      classNames('place-card__bookmark-button', 'button', {
        'place-card__bookmark-button--active': isBookmarked,
      }),
    [isBookmarked]
  );

  const ratingWidth = useMemo(
    () => getWidthByRatingPercent(offer?.rating ?? 0),
    [offer]
  );

  // Мемоизируем обработчики событий
  const handleMouseEnter = useCallback(() => {
    if (onCardHover && offer) {
      onCardHover(offer);
    }
  }, [onCardHover, offer]);

  const handleMouseLeave = useCallback(() => {
    if (onCardHover) {
      onCardHover(null);
    }
  }, [onCardHover]);

  const handleBookmarkClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (authorizationStatus !== 'AUTH') {
        navigate('/login');
        return;
      }

      if (offer) {
        const newStatus = isBookmarked ? 0 : 1;
        dispatch(
          changeFavoriteStatus({ offerId: offer.id, status: newStatus })
        )
          .unwrap()
          .catch(() => {
            // eslint-disable-next-line no-alert
            alert(
              'Failed to update favorite status. Please check your connection and try again.'
            );
          });
      }
    },
    [authorizationStatus, navigate, isBookmarked, dispatch, offer]
  );

  return (
    <article
      className='cities__card place-card'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {mark && (
        <div className='place-card__mark'>
          <span>{mark}</span>
        </div>
      )}
      <div className='cities__image-wrapper place-card__image-wrapper'>
        {offer ? (
          <Link to={`/offer/${offer.id}`} aria-label={`View ${name}`}>
            <img
              className='place-card__image'
              src={image}
              width='260'
              height='200'
              alt={name}
            />
          </Link>
        ) : (
          <img
            className='place-card__image'
            src={image}
            width='260'
            height='200'
            alt={name}
          />
        )}
      </div>
      <div className='place-card__info'>
        <div className='place-card__price-wrapper'>
          <div className='place-card__price'>
            <b className='place-card__price-value'>&euro;{price}</b>
            <span className='place-card__price-text'>&#47;&nbsp;night</span>
          </div>
          <button
            className={bookmarkButtonClassName}
            type='button'
            onClick={handleBookmarkClick}
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
            <span style={{ width: `${ratingWidth}%` }}></span>
            <span className='visually-hidden'>Rating</span>
          </div>
        </div>
        <h2 className='place-card__name'>
          {offer ? (
            <Link to={`/offer/${offer.id}`} aria-label={`View ${name}`}>
              {name}
            </Link>
          ) : (
            name
          )}
        </h2>
        <p className='place-card__type'>{type}</p>
      </div>
    </article>
  );
};

const CityCard = memo(CityCardComponent);
CityCard.displayName = 'CityCard';

export default CityCard;
