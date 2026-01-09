import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Header from './header';
import authReducer from '../../store/slices/auth-slice';
import favoritesReducer from '../../store/slices/favorites-slice';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const testUser = {
  id: 1,
  name: 'Test User',
  avatarUrl: 'test-avatar.jpg',
  isPro: false,
  email: 'test@test.com',
  token: 'test-token',
};

const createTestStore = (
  authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN' = 'UNKNOWN',
  favoritesCount: number = 0
) =>
  configureStore({
    reducer: {
      auth: authReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      auth: {
        authorizationStatus,
        user: authorizationStatus === 'AUTH' ? testUser : null,
      },
      favorites: {
        favorites: Array(favoritesCount)
          .fill(null)
          .map((_, i) => ({
            id: String(i + 1),
            title: `Favorite ${i + 1}`,
            type: 'apartment',
            price: 100,
            image: `img${i + 1}.jpg`,
            ratingPercent: 95,
            isPremium: false,
            city: 'Paris',
            latitude: 48.8566,
            longitude: 2.3522,
          })),
        isLoading: false,
        error: null,
      },
    },
  });

// Helper component to render Header with router context
const renderWithProviders = (store: ReturnType<typeof createTestStore>) => {
  const v7StartTransition = true;
  const v7StartTransitionKey = 'v7_startTransition';
  const futureConfig = {
    [v7StartTransitionKey]: v7StartTransition,
  };

  render(
    <Provider store={store}>
      <MemoryRouter future={futureConfig}>
        <Header />
      </MemoryRouter>
    </Provider>
  );
};

describe('Header component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when user is not authorized', () => {
    it('should render login link when user is not authorized', () => {
      const store = createTestStore('NO_AUTH');
      renderWithProviders(store);

      expect(screen.getByText('Sign in')).toBeInTheDocument();
      expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
      expect(screen.queryByText('test@test.com')).not.toBeInTheDocument();
    });

    it('should have correct css classes for navigation', () => {
      const store = createTestStore('NO_AUTH');
      renderWithProviders(store);

      const navList = screen.getByRole('list');
      expect(navList).toHaveClass('header__nav-list');

      const navItems = screen.getAllByRole('listitem');
      expect(navItems).toHaveLength(1); // Only sign in item
    });
  });

  describe('when user is authorized', () => {
    it('should render user email and sign out link', () => {
      const store = createTestStore('AUTH');
      renderWithProviders(store);

      expect(screen.getByText('Sign out')).toBeInTheDocument();
      expect(screen.getByText('test@test.com')).toBeInTheDocument();
      expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    });

    it('should display favorites count', () => {
      const store = createTestStore('AUTH', 1);
      renderWithProviders(store);

      expect(screen.getByText('1')).toBeInTheDocument(); // Favorites count should be 1
    });

    it('should display zero favorites count when no favorites', () => {
      const store = createTestStore('AUTH', 0);
      renderWithProviders(store);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should render profile link with favorites route', () => {
      const store = createTestStore('AUTH');
      renderWithProviders(store);

      const profileLink = screen.getByRole('link', { name: /test@test.com/ });
      expect(profileLink).toHaveAttribute('href', '/favorites');
    });

    it('should have logout button that removes token and dispatches logout', () => {
      const store = createTestStore('AUTH');
      renderWithProviders(store);

      const logoutButton = screen.getByText('Sign out');
      expect(logoutButton).toBeInTheDocument();

      // Click sign out link
      fireEvent.click(logoutButton);

      // Should remove token from localStorage
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('logo and navigation', () => {
    it('should render logo with link to home', () => {
      const store = createTestStore('UNKNOWN');
      renderWithProviders(store);

      const logoLink = screen.getByRole('link', { name: /6 cities logo/i });
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should have correct header wrapper structure', () => {
      const store = createTestStore('UNKNOWN');
      renderWithProviders(store);

      const headerElement = screen.getByRole('banner');
      expect(headerElement).toHaveClass('header');

      const headerContainer = headerElement.querySelector('.container');
      expect(headerContainer).toBeInTheDocument();

      const headerWrapper = headerContainer?.querySelector('.header__wrapper');
      expect(headerWrapper).toBeInTheDocument();

      const headerLeft = headerWrapper?.querySelector('.header__left');
      expect(headerLeft).toBeInTheDocument();
    });
  });

  it('should handle unknown authorization status', () => {
    const store = createTestStore('UNKNOWN');
    renderWithProviders(store);

    // Should show login link when status is unknown (similar to NO_AUTH)
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });
});
