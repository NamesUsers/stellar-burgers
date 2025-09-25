import {
  ingredientsSlice,
  fetchIngredients,
  initialState
} from '../services/slices/ingredientsSlice';

// Мокаем API
jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn().mockResolvedValue({
    success: true,
    data: [{ name: 'Lettuce' }, { name: 'Tomato' }]
  })
}));

describe('ingredientsSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен устанавливать isLoading в true при экшене Request', () => {
    const newState = ingredientsSlice.reducer(
      initialState, // ← используем импортированный initialState
      fetchIngredients.pending()
    );

    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('должен сохранять ингредиенты и устанавливать isLoading в false при экшене Success', () => {
    const ingredientsData = [{ name: 'Lettuce' }, { name: 'Tomato' }];

    const newState = ingredientsSlice.reducer(
      initialState, // ← используем импортированный initialState
      fetchIngredients.fulfilled(ingredientsData)
    );

    expect(newState.isLoading).toBe(false);
    expect(newState.items).toEqual(ingredientsData);
    expect(newState.error).toBeNull();
  });

  it('должен сохранять ошибку и устанавливать isLoading в false при экшене Failed', () => {
    const error = new Error('Не удалось загрузить ингредиенты');

    const newState = ingredientsSlice.reducer(
      initialState, // ← используем импортированный initialState
      fetchIngredients.rejected(error)
    );

    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe(error.message);
  });
});