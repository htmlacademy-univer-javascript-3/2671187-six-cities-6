import { FC } from 'react';
import { getWidthByRatingPercent } from '../../utils';

type ReviewProps = {
  review: Review;
};

export const Review: FC<ReviewProps> = ({ review }) => {
  const { user, rating, comment, date } = review;

  return (
    <li className='reviews__item'>
      <div className='reviews__user user'>
        <div className='reviews__avatar-wrapper user__avatar-wrapper'>
          <img
            className='reviews__avatar user__avatar'
            src={String(user.avatarUrl)}
            width='54'
            height='54'
            alt='Reviews avatar'
          />
        </div>
        <span className='reviews__user-name'>{user.name}</span>
      </div>
      <div className='reviews__info'>
        <div className='reviews__rating rating'>
          <div className='reviews__stars rating__stars'>
            <span
              style={{ width: `${getWidthByRatingPercent(rating)}%` }}
            ></span>
            <span className='visually-hidden'>Rating</span>
          </div>
        </div>
        <p className='reviews__text'>{comment}</p>
        <time className='reviews__time' dateTime={date}>
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          })}
        </time>
      </div>
    </li>
  );
};
