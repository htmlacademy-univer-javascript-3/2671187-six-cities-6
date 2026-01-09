import { FC, memo, useMemo } from 'react';
import { getWidthByRatingPercent } from '../../utils/formatters';

type ReviewProps = {
  review: Review;
};

export const Review: FC<ReviewProps> = memo(({ review }) => {
  const { user, rating, comment, date } = review;

  // Мемоизируем форматирование даты
  const formattedDate = useMemo(
    () =>
      new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      }),
    [date]
  );

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
          {formattedDate}
        </time>
      </div>
    </li>
  );
});

Review.displayName = 'Review';

