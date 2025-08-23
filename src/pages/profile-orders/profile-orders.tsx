import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/ordersHistorySlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();

  const orders = useAppSelector((s) => s.ordersHistory.orders);
  const isLoading = useAppSelector((s) => s.ordersHistory.isLoading);
  const hasLoadedOnce = useAppSelector((s) => s.ordersHistory.hasLoadedOnce);
  const error = useAppSelector((s) => s.ordersHistory.error);

  useEffect(() => {
    if (!hasLoadedOnce) dispatch(fetchUserOrders());
    const id = setInterval(() => dispatch(fetchUserOrders()), 15000);
    return () => clearInterval(id);
  }, [dispatch, hasLoadedOnce]);

  if (isLoading && !hasLoadedOnce) return <Preloader />;
  if (error) return <main className='p-10'>Ошибка: {error}</main>;

  return <ProfileOrdersUI orders={orders} />;
};
