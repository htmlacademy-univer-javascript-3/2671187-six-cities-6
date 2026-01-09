import { describe, it, expect } from 'vitest';
import { setAuthStatus, setUser, logout } from '../slices/auth-slice';
import { checkAuth, login } from '../api-actions';
import authReducer from '../slices/auth-slice';

const mockUser: AuthInfo = {
  id: 1,
  name: 'John Doe',
  avatarUrl: 'avatar.jpg',
  isPro: false,
  email: 'john@example.com',
  token: 'test-token',
};

describe('authSlice reducer', () => {
  const initialState = {
    authorizationStatus: 'UNKNOWN' as const,
    user: null,
  };

  it('should return the initial state', () => {
    const result = authReducer(undefined, { type: undefined });
    expect(result).toEqual(initialState);
  });

  describe('setAuthStatus action', () => {
    it('should set authorization status to AUTH', () => {
      const action = setAuthStatus('AUTH');
      const result = authReducer(initialState, action);

      expect(result.authorizationStatus).toBe('AUTH');
      expect(result.user).toBeNull();
    });

    it('should set authorization status to NO_AUTH', () => {
      const action = setAuthStatus('NO_AUTH');
      const result = authReducer(initialState, action);

      expect(result.authorizationStatus).toBe('NO_AUTH');
      expect(result.user).toBeNull();
    });

    it('should set authorization status to UNKNOWN', () => {
      const action = setAuthStatus('UNKNOWN');
      const result = authReducer(initialState, action);

      expect(result.authorizationStatus).toBe('UNKNOWN');
      expect(result.user).toBeNull();
    });
  });

  describe('setUser action', () => {
    it('should set user data', () => {
      const action = setUser(mockUser);
      const result = authReducer(initialState, action);

      expect(result.user).toEqual(mockUser);
      expect(result.authorizationStatus).toBe('UNKNOWN');
    });

    it('should set user to null', () => {
      const action = setUser(null);
      const result = authReducer(initialState, action);

      expect(result.user).toBeNull();
      expect(result.authorizationStatus).toBe('UNKNOWN');
    });

    it('should replace existing user', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
      };

      const newUser = { ...mockUser, id: 2, name: 'Jane Doe' };
      const action = setUser(newUser);
      const result = authReducer(stateWithUser, action);

      expect(result.user).toEqual(newUser);
      expect(result.user?.id).toBe(2);
    });
  });

  describe('logout action', () => {
    it('should reset state to logged out', () => {
      const stateWithUser = {
        authorizationStatus: 'AUTH' as const,
        user: mockUser,
      };

      const action = logout();
      const result = authReducer(stateWithUser, action);

      expect(result.authorizationStatus).toBe('NO_AUTH');
      expect(result.user).toBeNull();
    });

    it('should handle logout from unknown state', () => {
      const action = logout();
      const result = authReducer(initialState, action);

      expect(result.authorizationStatus).toBe('NO_AUTH');
      expect(result.user).toBeNull();
    });

    it('should handle logout from NO_AUTH state', () => {
      const stateNoAuth = {
        authorizationStatus: 'NO_AUTH' as const,
        user: null,
      };

      const action = logout();
      const result = authReducer(stateNoAuth, action);

      expect(result.authorizationStatus).toBe('NO_AUTH');
      expect(result.user).toBeNull();
    });
  });

  describe('checkAuth async actions', () => {
    it('should handle fulfilled - set AUTH status', () => {
      const action = checkAuth.fulfilled(undefined, 'requestId', undefined);
      const result = authReducer(initialState, action);

      expect(result.authorizationStatus).toBe('AUTH');
    });

    it('should handle rejected - set NO_AUTH status', () => {
      const action = checkAuth.rejected(
        new Error('Unauthorized'),
        'requestId',
        undefined
      );
      const result = authReducer(initialState, action);

      expect(result.authorizationStatus).toBe('NO_AUTH');
    });

    it('should not change user on checkAuth fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
      };

      const action = checkAuth.fulfilled(undefined, 'requestId', undefined);
      const result = authReducer(stateWithUser, action);

      expect(result.authorizationStatus).toBe('AUTH');
      expect(result.user).toEqual(mockUser);
    });
  });

  describe('login async actions', () => {
    it('should handle fulfilled - set AUTH status and user', () => {
      const action = login.fulfilled(mockUser, 'requestId', {
        email: 'john@example.com',
        password: 'password123',
      });
      const result = authReducer(initialState, action);

      expect(result.authorizationStatus).toBe('AUTH');
      expect(result.user).toEqual(mockUser);
    });

    it('should replace existing user on login', () => {
      const stateWithOldUser = {
        authorizationStatus: 'NO_AUTH' as const,
        user: { ...mockUser, id: 999, name: 'Old User' },
      };

      const action = login.fulfilled(mockUser, 'requestId', {
        email: 'john@example.com',
        password: 'password123',
      });
      const result = authReducer(stateWithOldUser, action);

      expect(result.authorizationStatus).toBe('AUTH');
      expect(result.user).toEqual(mockUser);
      expect(result.user?.id).toBe(1);
    });

    it('should handle rejected - keep current state', () => {
      const stateNoAuth = {
        authorizationStatus: 'NO_AUTH' as const,
        user: null,
      };

      const action = login.rejected(
        new Error('Invalid credentials'),
        'requestId',
        {
          email: 'john@example.com',
          password: 'wrong',
        }
      );
      const result = authReducer(stateNoAuth, action);

      expect(result.authorizationStatus).toBe('NO_AUTH');
      expect(result.user).toBeNull();
    });
  });
});
