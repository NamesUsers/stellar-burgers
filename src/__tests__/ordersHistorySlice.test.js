// ordersHistorySlice.test.js
import ordersHistorySlice, { initialState, clearOrders } from '../services/slices/ordersHistorySlice';

describe('ordersHistorySlice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(ordersHistorySlice(undefined, { type: 'UNKNOWN_ACTION' }))
      .toEqual(initialState);
  });

  it('должен обрабатывать clearOrders', () => {
    const stateWithData = { 
      ...initialState, 
      orders: [{ id: '1' }], 
      error: 'Some error',
      hasLoadedOnce: true 
    };
    
    const newState = ordersHistorySlice(stateWithData, clearOrders());
    
    expect(newState.orders).toEqual([]);
    expect(newState.error).toBeNull();
    expect(newState.hasLoadedOnce).toBe(false);
  });

  it('должен обрабатывать fetchUserOrders.pending', () => {
    const newState = ordersHistorySlice(initialState, { type: 'ordersHistory/fetchUserOrders/pending' });
    
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('должен обрабатывать fetchUserOrders.fulfilled', () => {
    const orders = [{ id: '1', name: 'Order 1' }, { id: '2', name: 'Order 2' }];
    const newState = ordersHistorySlice(initialState, { 
      type: 'ordersHistory/fetchUserOrders/fulfilled', 
      payload: orders 
    });
    
    expect(newState.isLoading).toBe(false);
    expect(newState.orders).toEqual(orders);
    expect(newState.hasLoadedOnce).toBe(true);
  });

  it('должен обрабатывать fetchUserOrders.rejected', () => {
    const error = 'Orders error';
    const newState = ordersHistorySlice(initialState, { 
      type: 'ordersHistory/fetchUserOrders/rejected', 
      payload: error 
    });
    
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe(error);
  });
});