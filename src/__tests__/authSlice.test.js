// authSlice.test.js
import authSlice, { initialState, setIsAuthChecked, setUser, clearError } from '../services/slices/authSlice';

// Моки уже настроены в jest.config.ts через moduleNameMapper

describe('authSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен возвращать начальное состояние', () => {
    expect(authSlice(undefined, { type: 'UNKNOWN_ACTION' }))
      .toEqual(initialState);
  });

  it('должен обрабатывать setUser', () => {
    const user = { name: 'Test', email: 'test@example.com' };
    const newState = authSlice(initialState, setUser(user));
    
    expect(newState.user).toEqual(user);
    expect(newState.error).toBeNull();
  });

  it('должен обрабатывать clearError', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const newState = authSlice(stateWithError, clearError());
    
    expect(newState.error).toBeNull();
  });

  it('должен обрабатывать setIsAuthChecked', () => {
    const newState = authSlice(initialState, setIsAuthChecked(true));
    expect(newState.isAuthChecked).toBe(true);
  });

  it('должен обрабатывать login.pending', () => {
    const newState = authSlice(initialState, { type: 'auth/login/pending' });
    
    expect(newState.loading).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('должен обрабатывать login.fulfilled', () => {
    const user = { name: 'Test', email: 'test@example.com' };
    const newState = authSlice(initialState, { 
      type: 'auth/login/fulfilled', 
      payload: user 
    });
    
    expect(newState.loading).toBe(false);
    expect(newState.user).toEqual(user);
    expect(newState.isAuthChecked).toBe(true);
  });

  it('должен обрабатывать login.rejected', () => {
    const error = 'Login failed';
    const newState = authSlice(initialState, { 
      type: 'auth/login/rejected', 
      payload: error 
    });
    
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(error);
  });
});