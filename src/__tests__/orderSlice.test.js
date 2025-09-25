// orderSlice.test.js
import orderSlice, { initialState, clearOrder } from '../services/slices/orderSlice';

describe('orderSlice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(orderSlice(undefined, { type: 'UNKNOWN_ACTION' }))
      .toEqual(initialState);
  });

  it('должен обрабатывать clearOrder', () => {
    const stateWithOrder = { ...initialState, orderNumber: 12345, error: 'Some error' };
    const newState = orderSlice(stateWithOrder, clearOrder());
    
    expect(newState.orderNumber).toBeNull();
    expect(newState.error).toBeNull();
  });

  it('должен обрабатывать createOrder.pending', () => {
    const newState = orderSlice(initialState, { type: 'order/create/pending' });
    
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('должен обрабатывать createOrder.fulfilled', () => {
    const orderNumber = 12345;
    const newState = orderSlice(initialState, { 
      type: 'order/create/fulfilled', 
      payload: orderNumber 
    });
    
    expect(newState.isLoading).toBe(false);
    expect(newState.orderNumber).toBe(orderNumber);
  });

  it('должен обрабатывать createOrder.rejected', () => {
    const error = 'Order failed';
    const newState = orderSlice(initialState, { 
      type: 'order/create/rejected', 
      payload: error 
    });
    
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe(error);
  });
});