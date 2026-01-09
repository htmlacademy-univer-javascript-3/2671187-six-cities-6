import { memo, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectAuthorizationStatus } from '../../store/selectors';
import { changeFavoriteStatus } from '../../store/api-actions';

type NearbyOfferCardProps = {
  offer: Offer;
};

function NearbyOfferCardComponent({
  offer,
}: NearbyOfferCardProps): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  const {
    isPremium = false,
    isFavorite: isBookmarked = false,
    previewImage: image,
    price,
    rating,
    title,
    type,
  } = offer;

  // Мемоизируем вычисления
  const ratingPercent = useMemo(() => rating * 20, [rating]);
  const bookmarkButtonClassName = useMemo(
    () =>
      classNames('place-card__bookmark-button', 'button', {
        'place-card__bookmark-button--active': isBookmarked,
      }),
    [isBookmarked]
  );

  const handleBookmarkClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (authorizationStatus !== 'AUTH') {
        navigate('/login');
        return;
      }

      const newStatus = isBookmarked ? 0 : 1;
      dispatch(changeFavoriteStatus({ offerId: offer.id, status: newStatus }));
    },
    [authorizationStatus, navigate, isBookmarked, dispatch, offer.id]
  );

  return (
    <article className='near-places__card place-card'>
      {isPremium && (
        <div className='place-card__mark'>
          <span>Premium</span>
        </div>
      )}
      <div className='near-places__image-wrapper place-card__image-wrapper'>
        <Link to={`/offer/${offer.id}`}>
          <img
            className='place-card__image'
            src={image}
            width='260'
            height='200'
            alt='Place image'
          />
        </Link>
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
            <span style={{ width: `${ratingPercent}%` }}></span>
            <span className='visually-hidden'>Rating</span>
          </div>
        </div>
        <h2 className='place-card__name'>
          <Link to={`/offer/${offer.id}`}>{title}</Link>
        </h2>
        <p className='place-card__type'>{type}</p>
      </div>
    </article>
  );
}

const NearbyOfferCard = memo(NearbyOfferCardComponent);
NearbyOfferCard.displayName = 'NearbyOfferCard';

export default NearbyOfferCard;
