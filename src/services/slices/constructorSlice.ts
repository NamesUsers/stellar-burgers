import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid'; // Используем uuid для генерации уникального id
import { TIngredient } from '@utils-types'; // Тип ингредиента
import type { RootState } from '../store';

// Расширяем тип ингредиента для конструктора
type TConstructorIngredient = TIngredient & {
  id: string; // Добавляем обязательное поле id
};

interface IConstructorState {
  bun: TIngredient | null; // Булки не нуждаются в уникальном id
  ingredients: TConstructorIngredient[];
}

const initialState: IConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Экшн для замены булки
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },

    // Экшн для добавления ингредиента с UUID
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload; // Если булка, заменяем
        } else {
          state.ingredients.push(action.payload); // Добавляем ингредиент в массив
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: uuidv4() // Генерация UUID для ингредиента
        }
      })
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const newIngredients = [...state.ingredients];
      const [removed] = newIngredients.splice(dragIndex, 1);
      newIngredients.splice(hoverIndex, 0, removed);
      state.ingredients = newIngredients;
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

// Селекторы
export const selectBurgerConstructor = (state: RootState) =>
  state.burgerConstructor;
export const selectBun = (state: RootState) => state.burgerConstructor.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

export default burgerConstructorSlice.reducer;
