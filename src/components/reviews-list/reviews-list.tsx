import { memo } from 'react';
import { Review } from '../review';
import ReviewForm from '../review-form';
import { useAppSelector } from '../../store';
import { selectAuthorizationStatus } from '../../store/selectors';

type ReviewsListProps = {
  reviews: Review[];
};

function ReviewsList({ reviews }: ReviewsListProps): JSX.Element {
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  return (
    <section className='offer__reviews reviews'>
      <h2 className='reviews__title'>
        Reviews &middot;{' '}
        <span className='reviews__amount'>{reviews.length}</span>
      </h2>
      <ul className='reviews__list'>
        {reviews.map(review => (
          <Review key={review.id} review={review} />
        ))}
      </ul>
      {authorizationStatus === 'AUTH' && <ReviewForm />}
    </section>
  );
}

export default memo(ReviewsList);
