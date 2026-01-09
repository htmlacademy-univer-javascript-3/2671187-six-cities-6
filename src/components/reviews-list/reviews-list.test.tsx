import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import ReviewsList from './reviews-list';
import authReducer from '../../store/slices/auth-slice';

vi.mock('../review/review', () => ({
  Review: ({ review }: { review: Review }) => (
    <li data-testid={`review-${review.id}`}>{review.comment}</li>
  ),
}));

vi.mock('../review-form', () => ({
  default: () => <form data-testid='review-form'>Review Form</form>,
}));

const testUser = {
  id: 1,
  name: 'Test User',
  avatarUrl: 'test-avatar.jpg',
  isPro: false,
  email: 'test@test.com',
  token: 'test-token',
};

const createTestStore = (
  authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN' = 'UNKNOWN'
) =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        authorizationStatus,
        user: authorizationStatus === 'AUTH' ? testUser : null,
      },
    },
  });

const renderReviewsList = (
  reviews: Review[],
  authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN' = 'UNKNOWN'
) => {
  const store = createTestStore(authorizationStatus);

  return render(
    <Provider store={store}>
      <ReviewsList reviews={reviews} />
    </Provider>
  );
};

describe('ReviewsList component', () => {
  const mockReviews: Review[] = [
    {
      id: '1',
      user: {
        name: 'John Doe',
        avatarUrl: 'avatar1.jpg',
        isPro: true,
      },
      rating: 5,
      comment: 'Great place!',
      date: '2024-01-15',
    },
    {
      id: '2',
      user: {
        name: 'Jane Smith',
        avatarUrl: 'avatar2.jpg',
        isPro: false,
      },
      rating: 4,
      comment: 'Nice apartment',
      date: '2024-01-14',
    },
  ];

  it('should render reviews section with title', () => {
    renderReviewsList(mockReviews);

    expect(screen.getByText(/reviews/i)).toBeInTheDocument();
  });

  it('should display correct number of reviews', () => {
    renderReviewsList(mockReviews);

    expect(screen.getByText('2')).toBeInTheDocument(); // reviews.length
  });

  it('should display zero when no reviews', () => {
    renderReviewsList([]);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render all reviews', () => {
    renderReviewsList(mockReviews);

    expect(screen.getByTestId('review-1')).toBeInTheDocument();
    expect(screen.getByTestId('review-2')).toBeInTheDocument();
  });

  it('should render review comments', () => {
    renderReviewsList(mockReviews);

    expect(screen.getByText('Great place!')).toBeInTheDocument();
    expect(screen.getByText('Nice apartment')).toBeInTheDocument();
  });

  it('should display ReviewForm when user is authorized', () => {
    renderReviewsList(mockReviews, 'AUTH');

    expect(screen.getByTestId('review-form')).toBeInTheDocument();
  });

  it('should not display ReviewForm when user is not authorized', () => {
    renderReviewsList(mockReviews, 'NO_AUTH');

    expect(screen.queryByTestId('review-form')).not.toBeInTheDocument();
  });

  it('should not display ReviewForm when authorization status is unknown', () => {
    renderReviewsList(mockReviews, 'UNKNOWN');

    expect(screen.queryByTestId('review-form')).not.toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    renderReviewsList(mockReviews);

    const section = document.querySelector('.offer__reviews.reviews');
    expect(section).toBeInTheDocument();

    const title = screen.getByText(/reviews/i);
    expect(title).toHaveClass('reviews__title');

    const list = screen.getByRole('list');
    expect(list).toHaveClass('reviews__list');
  });

  it('should render empty reviews list correctly', () => {
    renderReviewsList([]);

    expect(screen.getByText('0')).toBeInTheDocument();
    const list = screen.getByRole('list');
    expect(list.children).toHaveLength(0);
  });

  it('should render single review correctly', () => {
    const singleReview = [mockReviews[0]];
    renderReviewsList(singleReview);

    expect(screen.getByTestId('review-1')).toBeInTheDocument();
    expect(screen.queryByTestId('review-2')).not.toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
