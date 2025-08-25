import React, { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/ordersHistorySlice';
import { Preloader } from '@ui';
import { getUserApi } from '../../utils/burger-api';
import ProtectedRoute from '../../components/protected-route/protected-route';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();

  // Данные о заказах
  const orders = useAppSelector((s) => s.ordersHistory.orders);
  const isLoading = useAppSelector((s) => s.ordersHistory.isLoading);
  const hasLoadedOnce = useAppSelector((s) => s.ordersHistory.hasLoadedOnce);
  const error = useAppSelector((s) => s.ordersHistory.error);

  // Стейт пользователя
  const [user, setUser] = React.useState<any | null>(null); // Данные пользователя
  const [userLoading, setUserLoading] = React.useState(true); // Лоадер для данных пользователя
  const [userError, setUserError] = React.useState<string | null>(null); // Ошибка при загрузке данных пользователя

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserApi(); // Получаем данные пользователя
        setUser(userData.user);
      } catch (err) {
        setUserError('You should be authorised'); // Ошибка авторизации
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (user && !hasLoadedOnce) {
      dispatch(fetchUserOrders()); // Загружаем заказы после получения данных пользователя
    }

    // Обновляем заказы каждые 15 секунд
    const id = setInterval(() => dispatch(fetchUserOrders()), 15000);
    return () => clearInterval(id); // Очищаем интервал при размонтировании компонента
  }, [dispatch, hasLoadedOnce, user]);

  // Если данные пользователя еще загружаются, показываем лоадер
  if (userLoading) return <Preloader />;
  if (userError) return <main className='p-10'>{userError}</main>; // Ошибка при загрузке данных пользователя

  // Если заказы еще загружаются, показываем лоадер
  if (isLoading && !hasLoadedOnce) return <Preloader />;
  if (error) return <main className='p-10'>Ошибка: {error}</main>; // Ошибка при загрузке заказов

  // Защищаем маршрут истории заказов с помощью ProtectedRoute
  return (
    <ProtectedRoute>
      <ProfileOrdersUI orders={orders} />
    </ProtectedRoute>
  );
};
