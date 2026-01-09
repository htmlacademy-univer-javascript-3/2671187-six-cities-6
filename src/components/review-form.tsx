import { FC, FormEvent, ChangeEvent, useState } from 'react';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../store';
import { submitComment } from '../store/api-actions';
import {
  selectCurrentOffer,
  selectIsCommentSubmitting,
} from '../store/selectors';
import './review-form/review-form.css';

const ratingLabelsMap: Record<number, string> = {
  5: 'perfect',
  4: 'good',
  3: 'not bad',
  2: 'badly',
  1: 'terribly',
};

const getRatingTitle = (rating: number): string =>
  ratingLabelsMap[rating] ?? '';

const ReviewForm: FC = () => {
  const dispatch = useAppDispatch();
  const currentOffer = useAppSelector(selectCurrentOffer);
  const isCommentSubmitting = useAppSelector(selectIsCommentSubmitting);

  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    review: '',
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating,
    }));
    setError(null);
  };

  const handleReviewChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      review: event.target.value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentOffer) {
      return;
    }

    if (formData.review.length < 50 || formData.review.length > 300) {
      setError('Review must be between 50 and 300 characters.');
      return;
    }

    setError(null);

    dispatch(
      submitComment({
        offerId: currentOffer.id,
        commentData: {
          comment: formData.review,
          rating: formData.rating,
        },
      })
    )
      .unwrap()
      .then(() => {
        setFormData({
          rating: 0,
          review: '',
        });
        setHoveredRating(0);
      })
      .catch(() => {
        setError('Something went wrong. Please try again later.');
      });
  };

  const isFormValid =
    formData.rating > 0 &&
    formData.review.length >= 50 &&
    formData.review.length <= 300;

  return (
    <form
      className='reviews__form form'
      action='#'
      method='post'
      onSubmit={handleSubmit}
    >
      <label className='reviews__label form__label' htmlFor='review'>
        Your review
      </label>
      <div className='reviews__rating-form form__rating'>
        {[5, 4, 3, 2, 1].map(rating => (
          <div key={rating}>
            <input
              className='form__rating-input visually-hidden'
              name='rating'
              value={rating}
              id={`${rating}-stars`}
              type='radio'
              checked={formData.rating === rating}
              onChange={() => handleRatingChange(rating)}
              disabled={isCommentSubmitting}
              aria-label={`${rating}-stars`}
            />
            <label
              htmlFor={`${rating}-stars`}
              className={classNames(
                'reviews__rating-label form__rating-label',
                {
                  'form__rating-label--active':
                    hoveredRating > 0
                      ? rating <= hoveredRating
                      : rating <= formData.rating,
                  'form__rating-label--reset': hoveredRating > 0,
                }
              )}
              title={getRatingTitle(rating)}
              aria-label={getRatingTitle(rating)}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <svg className='form__star-image' width='37' height='33'>
                <use xlinkHref='#icon-star'></use>
              </svg>
            </label>
          </div>
        ))}
      </div>
      <textarea
        className='reviews__textarea form__textarea'
        id='review'
        name='review'
        placeholder='Tell how was your stay, what you like and what can be improved'
        value={formData.review}
        onChange={handleReviewChange}
        disabled={isCommentSubmitting}
      />
      <div className='reviews__button-wrapper'>
        <p className='reviews__help'>
          To submit review please make sure to set{' '}
          <span className='reviews__star'>rating</span> and describe your stay
          with at least <b className='reviews__text-amount'>50 characters</b>.
          {formData.review.length > 0 && (
            <span className='reviews__char-count'>
              <span
                className={classNames({
                  'reviews__char-invalid': formData.review.length < 50,
                })}
              >
                {formData.review.length}
              </span>
              /300
            </span>
          )}
        </p>
        <button
          className='reviews__submit form__submit button'
          type='submit'
          disabled={!isFormValid || isCommentSubmitting}
        >
          {isCommentSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      {error && <div className='reviews__error'>{error}</div>}
    </form>
  );
};

export default ReviewForm;
