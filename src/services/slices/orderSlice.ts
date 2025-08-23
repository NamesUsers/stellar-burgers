import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';

type OrderState = {
  isLoading: boolean;
  error: string | null;
  orderNumber: number | null;
};

const initialState: OrderState = {
  isLoading: false,
  error: null,
  orderNumber: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const res = await orderBurgerApi(ingredientIds);
      return res.order.number as number;
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
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.isLoading = false;
          state.orderNumber = action.payload;
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
