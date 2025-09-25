// feedSlice.test.js
import feedSlice, { initialState } from '../services/slices/feedSlice';

describe('feedSlice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(feedSlice(undefined, { type: 'UNKNOWN_ACTION' }))
      .toEqual(initialState);
  });

  it('должен обрабатывать fetchFeeds.pending', () => {
    const newState = feedSlice(initialState, { type: 'feed/fetchFeeds/pending' });
    
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('должен обрабатывать fetchFeeds.fulfilled', () => {
    const feedData = {
      orders: [{ id: '1', name: 'Order 1' }],
      total: 100,
      totalToday: 10
    };
    
    const newState = feedSlice(initialState, { 
      type: 'feed/fetchFeeds/fulfilled', 
      payload: feedData 
    });
    
    expect(newState.isLoading).toBe(false);
    expect(newState.orders).toEqual(feedData.orders);
    expect(newState.total).toBe(feedData.total);
    expect(newState.totalToday).toBe(feedData.totalToday);
    expect(newState.hasLoadedOnce).toBe(true);
  });

  it('должен обрабатывать fetchFeeds.rejected', () => {
    const error = 'Feed error';
    const newState = feedSlice(initialState, { 
      type: 'feed/fetchFeeds/rejected', 
      payload: error 
    });
    
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe(error);
  });
});