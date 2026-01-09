import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Review } from '../review/review';

const mockReview: Review = {
  id: '1',
  user: {
    name: 'John Doe',
    avatarUrl: 'https://example.com/avatar.jpg',
    isPro: true,
  },
  rating: 5,
  comment: 'Great place to stay! Very comfortable and clean.',
  date: '2023-12-01T00:00:00.000Z',
};

describe('Review component', () => {
  it('should render the review container with correct structure', () => {
    render(<Review review={mockReview} />);

    const reviewElement = document.querySelector('.reviews__item');
    expect(reviewElement).toBeInTheDocument();
  });

  it('should render user information correctly', () => {
    render(<Review review={mockReview} />);

    const avatar = screen.getByAltText('Reviews avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockReview.user.avatarUrl);

    expect(screen.getByText(mockReview.user.name)).toBeInTheDocument();
  });

  it('should render rating stars with correct width', () => {
    render(<Review review={mockReview} />);

    const ratingStars = document.querySelector('.reviews__stars');
    expect(ratingStars).toBeInTheDocument();

    const ratingSpan = ratingStars?.querySelector('span');
    expect(ratingSpan).toBeInTheDocument();
    expect(ratingSpan).toHaveStyle({ width: '100%' });
  });

  it('should render the comment text', () => {
    render(<Review review={mockReview} />);

    expect(screen.getByText(mockReview.comment)).toBeInTheDocument();
  });

  it('should render the formatted date', () => {
    render(<Review review={mockReview} />);

    const timeElement = document.querySelector('.reviews__time');
    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveAttribute('dateTime', mockReview.date);

    expect(screen.getByText('December 2023')).toBeInTheDocument();
  });

  it('should render different rating values correctly', () => {
    const reviewWith3Stars: Review = {
      ...mockReview,
      rating: 3,
    };

    render(<Review review={reviewWith3Stars} />);

    const ratingSpan = document.querySelector('.reviews__stars span');
    expect(ratingSpan).toHaveStyle({ width: '60%' });
  });

  it('should render rating 1 correctly', () => {
    const reviewWith1Star: Review = {
      ...mockReview,
      rating: 1,
    };

    render(<Review review={reviewWith1Star} />);

    const ratingSpan = document.querySelector('.reviews__stars span');
    expect(ratingSpan).toHaveStyle({ width: '20%' });
  });

  it('should render rating 4.5 correctly (rounded to 5)', () => {
    const reviewWith4_5Stars: Review = {
      ...mockReview,
      rating: 4.5,
    };

    render(<Review review={reviewWith4_5Stars} />);

    const ratingSpan = document.querySelector('.reviews__stars span');
    expect(ratingSpan).toHaveStyle({ width: '100%' });
  });

  it('should handle long comments', () => {
    const longComment =
      'This is a very long comment that goes on and on. '.repeat(5);
    const reviewWithLongComment: Review = {
      ...mockReview,
      comment: longComment,
    };

    render(<Review review={reviewWithLongComment} />);

    expect(screen.getByText(longComment.trim())).toBeInTheDocument();
  });

  it('should render different dates correctly', () => {
    const reviewWithDifferentDate: Review = {
      ...mockReview,
      date: '2023-04-15T00:00:00.000Z',
    };

    render(<Review review={reviewWithDifferentDate} />);

    expect(screen.getByText('April 2023')).toBeInTheDocument();
  });

  it('should render non-pro user correctly', () => {
    const reviewWithNonPro: Review = {
      ...mockReview,
      user: {
        ...mockReview.user,
        isPro: false,
      },
    };

    render(<Review review={reviewWithNonPro} />);

    expect(screen.getByText(reviewWithNonPro.user.name)).toBeInTheDocument();
  });
});

