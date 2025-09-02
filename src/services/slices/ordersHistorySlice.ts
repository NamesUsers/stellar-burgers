import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

type OrdersHistoryState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  hasLoadedOnce: boolean;
};

const initialState: OrdersHistoryState = {
  orders: [],
  isLoading: false,
  error: null,
  hasLoadedOnce: false
};

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('ordersHistory/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    const orders = await getOrdersApi();
    return orders ?? [];
  } catch (e: any) {
    return rejectWithValue(
      e?.message ?? 'Не удалось загрузить историю заказов'
    );
  }
});

const ordersHistorySlice = createSlice({
  name: 'ordersHistory',
  initialState,
  reducers: {
    clearOrders(state) {
      state.orders = [];
      state.error = null;
      state.hasLoadedOnce = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
          state.hasLoadedOnce = true;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки истории заказов';
      });
  }
});

export const { clearOrders } = ordersHistorySlice.actions;
export default ordersHistorySlice.reducer;
