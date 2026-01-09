import { FC, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { submitComment } from '../store/api-actions';

const ReviewForm: FC = () => {
  const dispatch = useAppDispatch();

  const currentOffer = useAppSelector(state => state.offerDetails.currentOffer);
  const isCommentSubmitting = useAppSelector(
    state => state.offerDetails.isCommentSubmitting
  );

  const [formData, setFormData] = useState({
    rating: 0,
    review: '',
  });

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating,
    }));
  };

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      review: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentOffer) {
      return;
    }

    void dispatch(
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
        // Сброс формы после отправки
        setFormData({
          rating: 0,
          review: '',
        });
      })
      .catch(() => {
        // Обработка ошибки - можно добавить уведомление пользователю
      });
  };

  const getRatingTitle = (rating: number): string => {
    const ratingLabelsMap: { [key: string]: string } = {
      5: 'perfect',
      4: 'good',
      3: 'not bad',
      2: 'badly',
      1: 'terribly',
    };

    return ratingLabelsMap[rating] || '';
  };

  const isFormValid = formData.rating > 0 && formData.review.length >= 50;

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
            />
            <label
              htmlFor={`${rating}-stars`}
              className='reviews__rating-label form__rating-label'
              title={getRatingTitle(rating)}
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
      />
      <div className='reviews__button-wrapper'>
        <p className='reviews__help'>
          To submit review please make sure to set{' '}
          <span className='reviews__star'>rating</span> and describe your stay
          with at least <b className='reviews__text-amount'>50 characters</b>.
          {formData.review.length > 0 && (
            <span className='reviews__char-count'>
              {' '}
              ({formData.review.length}/50)
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
    </form>
  );
};

export default ReviewForm;
