// burgerConstructor.test.js
// Этот тест не использует API, поэтому мок не обязателен
jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn(),
  BURGER_API_URL: 'https://norma.nomoreparties.space/api'
}));

import { burgerConstructorSlice } from '../services/slices/constructorSlice';
const { addIngredient, removeIngredient, moveIngredient } =
  burgerConstructorSlice.actions;

describe('burgerConstructorSlice', () => {
  it('должен добавлять ингредиент с уникальным id', () => {
    const initialState = { bun: null, ingredients: [] };
    const ingredient = { type: 'ingredient', name: 'Lettuce' };

    const newState = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(ingredient)
    );

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toHaveProperty('id');
    expect(newState.ingredients[0].type).toBe('ingredient');
    expect(newState.ingredients[0].name).toBe('Lettuce');
  });

  it('должен удалять ингредиент по id', () => {
    const initialState = {
      bun: null,
      ingredients: [
        { id: '1', name: 'Lettuce' },
        { id: '2', name: 'Cheese' }
      ]
    };

    const newState = burgerConstructorSlice.reducer(
      initialState,
      removeIngredient('1')
    );

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0].id).toBe('2');
    expect(newState.ingredients[0].name).toBe('Cheese');
  });

  it('должен менять порядок ингредиентов', () => {
    const initialState = {
      bun: null,
      ingredients: [
        { id: '1', name: 'Lettuce' },
        { id: '2', name: 'Tomato' },
        { id: '3', name: 'Cheese' }
      ]
    };

    const newState = burgerConstructorSlice.reducer(
      initialState,
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );

    expect(newState.ingredients[0].name).toBe('Tomato');
    expect(newState.ingredients[1].name).toBe('Lettuce');
    expect(newState.ingredients[2].name).toBe('Cheese');
  });

  // Убираем проблемный тест или исправляем его
  it('должен корректно обрабатывать пустой массив при перемещении', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };

    // Для пустого массива перемещение не должно ничего менять
    const newState = burgerConstructorSlice.reducer(
      initialState,
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );

    expect(newState.ingredients).toEqual([]);
  });
});
