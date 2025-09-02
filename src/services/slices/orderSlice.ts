import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api'; // Убедитесь, что путь правильный
import { TUser } from '../../utils/types'; // Импортируем тип TUser
import { getUserApi } from '../../utils/burger-api';
type OrderState = {
  isLoading: boolean;
  error: string | null;
  orderNumber: number | null;
  user: TUser | null; // Добавляем данные о пользователе
};

const initialState: OrderState = {
  isLoading: false,
  error: null,
  orderNumber: null,
  user: null // Изначально user равен null
};

// Новый thunk для загрузки данных пользователя
export const fetchUser = createAsyncThunk(
  'order/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await getUserApi();
      return userData.user;
    } catch (e: any) {
      return rejectWithValue('You should be authorised');
    }
  }
);

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      // Получаем ответ от orderBurgerApi
      const response = await orderBurgerApi(ingredientIds);
      // Возвращаем только порядковый номер
      return response.orderNumber;
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Failed to create order');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderNumber = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload; // Сохраняем данные пользователя
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.isLoading = false;
          state.orderNumber = action.payload; // Сохраняем порядковый номер
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Unknown error';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
