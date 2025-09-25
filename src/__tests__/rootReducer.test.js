// rootReducer.test.js
// Мокаем проблемные модули перед импортом
jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn(),
  createOrderApi: jest.fn(),
  getUserApi: jest.fn(),
  loginApi: jest.fn(),
  logoutApi: jest.fn(),
  registerApi: jest.fn(),
  updateUserApi: jest.fn(),
  refreshTokenApi: jest.fn(),
  resetPasswordApi: jest.fn(),
  forgotPasswordApi: jest.fn(),
  BURGER_API_URL: 'https://norma.nomoreparties.space/api'
}));

// Импортируем сам редьюсер, а не store
import { rootReducer } from '../services/store'; // или правильный путь к редьюсеру

describe('rootReducer', () => {
  it('должен инициализировать состояние с правильной структурой', () => {
    // Используем пустое действие для инициализации
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toHaveProperty('auth');
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('order');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('ordersHistory');
  });
});
