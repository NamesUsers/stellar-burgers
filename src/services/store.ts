import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import authReducer from './slices/authSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import burgerConstructorReducer from './slices/constructorSlice'; // Изменено имя импорта
import orderReducer from './slices/orderSlice';
import feedReducer from './slices/feedSlice';
import ordersHistoryReducer from './slices/ordersHistorySlice';

// Собираем корневой редьюсер с помощью combineReducers
const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer, // Ключ должен совпадать с именем в слайсе
  order: orderReducer,
  feed: feedReducer,
  ordersHistory: ordersHistoryReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  // Добавляем middleware по умолчанию
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // Отключаем, если не нужна строгая проверка сериализуемости
    })
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Типизированные хуки для использования в компонентах
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
