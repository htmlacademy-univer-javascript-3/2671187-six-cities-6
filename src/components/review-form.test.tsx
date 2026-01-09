import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import ReviewForm from './review-form';
import offerDetailsReducer from '../store/slices/offer-details-slice';

const mockDispatch = vi.fn();

vi.mock('../store', async () => {
  const actual: typeof Object = await vi.importActual('../store');
  return {
    ...actual,
    useAppDispatch: () => mockDispatch,
  };
});

const mockCurrentOffer: OfferDetails = {
  id: '1',
  title: 'Beautiful Apartment',
  type: 'apartment',
  price: 150,
  images: ['image1.jpg', 'image2.jpg'],
  description: 'A beautiful apartment',
  rating: 4.5,
  isPremium: true,
  isFavorite: false,
  bedrooms: 2,
  maxAdults: 4,
  goods: ['WiFi', 'Heating'],
  host: {
    name: 'John Doe',
    avatarUrl: 'avatar.jpg',
    isPro: true,
  },
  city: {
    name: 'Paris',
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  },
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
};

const createTestStore = (
  currentOffer: OfferDetails | null = mockCurrentOffer,
  isCommentSubmitting: boolean = false
) =>
  configureStore({
    reducer: {
      offerDetails: offerDetailsReducer,
    },
    preloadedState: {
      offerDetails: {
        currentOffer,
        nearbyOffers: [],
        comments: [],
        isOfferLoading: false,
        isCommentSubmitting,
        error: null,
      },
    },
  });

const renderReviewForm = (
  currentOffer: OfferDetails | null = mockCurrentOffer,
  isCommentSubmitting: boolean = false
) => {
  const store = createTestStore(currentOffer, isCommentSubmitting);

  return render(
    <Provider store={store}>
      <ReviewForm />
    </Provider>
  );
};

describe('ReviewForm component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form elements', () => {
    renderReviewForm();

    expect(screen.getByLabelText('Your review')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Tell how was your stay/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should render all rating stars (1-5)', () => {
    renderReviewForm();

    for (let i = 1; i <= 5; i++) {
      const ratingInput = screen.getByRole('radio', {
        name: new RegExp(`${i}-stars`, 'i'),
      });
      expect(ratingInput).toBeInTheDocument();
    }
  });

  it('should allow selecting rating', () => {
    renderReviewForm();

    const rating5 = screen
      .getByLabelText(/perfect/i)
      .closest('div')
      ?.querySelector('input[type="radio"]') as HTMLInputElement;
    fireEvent.click(rating5);

    expect(rating5).toBeChecked();
  });

  it('should allow entering review text', () => {
    renderReviewForm();

    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const testText =
      'This is a test review with more than 50 characters to pass validation';

    fireEvent.change(textarea, { target: { value: testText } });

    expect(textarea).toHaveValue(testText);
  });

  it('should display character count when text is entered', () => {
    renderReviewForm();

    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const testText = 'Short text';

    fireEvent.change(textarea, { target: { value: testText } });

    expect(screen.getByText(/\(10\/50\)/)).toBeInTheDocument();
  });

  it('should disable submit button when form is invalid (no rating)', () => {
    renderReviewForm();

    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(textarea, {
      target: {
        value:
          'This is a test review with more than 50 characters to pass validation',
      },
    });

    expect(submitButton).toBeDisabled();
  });

  it('should disable submit button when form is invalid (text too short)', () => {
    renderReviewForm();

    const rating5 = screen
      .getByLabelText(/perfect/i)
      .closest('div')
      ?.querySelector('input[type="radio"]') as HTMLInputElement;
    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.click(rating5);
    fireEvent.change(textarea, { target: { value: 'Short' } });

    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', () => {
    renderReviewForm();

    const rating5 = screen
      .getByLabelText(/perfect/i)
      .closest('div')
      ?.querySelector('input[type="radio"]') as HTMLInputElement;
    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.click(rating5);
    fireEvent.change(textarea, {
      target: {
        value:
          'This is a test review with more than 50 characters to pass validation',
      },
    });

    expect(submitButton).not.toBeDisabled();
  });

  it('should disable submit button when comment is submitting', () => {
    renderReviewForm(mockCurrentOffer, true);

    const rating5 = screen
      .getByLabelText(/perfect/i)
      .closest('div')
      ?.querySelector('input[type="radio"]') as HTMLInputElement;
    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const submitButton = screen.getByRole('button', { name: /submitting.../i });

    fireEvent.click(rating5);
    fireEvent.change(textarea, {
      target: {
        value:
          'This is a test review with more than 50 characters to pass validation',
      },
    });

    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
  });

  it('should dispatch submitComment action on form submit', () => {
    const mockUnwrap = vi.fn().mockResolvedValue({});
    const mockAction = {
      unwrap: mockUnwrap,
    };
    mockDispatch.mockReturnValue(mockAction as any);

    renderReviewForm();

    const rating5 = screen
      .getByLabelText(/perfect/i)
      .closest('div')
      ?.querySelector('input[type="radio"]') as HTMLInputElement;
    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const form = textarea.closest('form');
    const testReview =
      'This is a test review with more than 50 characters to pass validation';

    fireEvent.click(rating5);
    fireEvent.change(textarea, { target: { value: testReview } });
    fireEvent.submit(form!);

    expect(mockDispatch).toHaveBeenCalled();
    const dispatchedAction = (mockDispatch.mock.calls[0]?.[0] as {
      type: string;
    }) || { type: '' };
    expect(dispatchedAction.type).toContain('submitComment');
  });

  it('should not submit form when currentOffer is null', () => {
    renderReviewForm(null);

    const rating5 = screen
      .getByLabelText(/perfect/i)
      .closest('div')
      ?.querySelector('input[type="radio"]') as HTMLInputElement;
    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const form = textarea.closest('form');
    const testReview =
      'This is a test review with more than 50 characters to pass validation';

    fireEvent.click(rating5);
    fireEvent.change(textarea, { target: { value: testReview } });
    fireEvent.submit(form!);

    // Form should not dispatch when currentOffer is null
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should display rating titles correctly', () => {
    renderReviewForm();

    const rating5Label = screen.getByTitle('perfect');
    const rating4Label = screen.getByTitle('good');
    const rating3Label = screen.getByTitle('not bad');
    const rating2Label = screen.getByTitle('badly');
    const rating1Label = screen.getByTitle('terribly');

    expect(rating5Label).toBeInTheDocument();
    expect(rating4Label).toBeInTheDocument();
    expect(rating3Label).toBeInTheDocument();
    expect(rating2Label).toBeInTheDocument();
    expect(rating1Label).toBeInTheDocument();
  });

  it('should have correct form structure and classes', () => {
    renderReviewForm();

    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const form = textarea.closest('form');
    expect(form).toHaveClass('reviews__form', 'form');
    expect(textarea).toHaveClass('reviews__textarea', 'form__textarea');
  });
});
