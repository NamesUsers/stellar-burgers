import React, { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/ordersHistorySlice';
import { Preloader } from '@ui';
import { getUserApi } from '../../utils/burger-api';
import ProtectedRoute from '../../components/protected-route/protected-route';

interface ProfileOrdersProps {
  onOrderClick?: (orderNumber: string) => void;
}

export const ProfileOrders: FC<ProfileOrdersProps> = ({ onOrderClick }) => {
  const dispatch = useAppDispatch();

  // Данные о заказах
  const orders = useAppSelector((s) => s.ordersHistory.orders);
  const isLoading = useAppSelector((s) => s.ordersHistory.isLoading);
  const hasLoadedOnce = useAppSelector((s) => s.ordersHistory.hasLoadedOnce);
  const error = useAppSelector((s) => s.ordersHistory.error);

  // Стейт пользователя
  const [user, setUser] = React.useState<any | null>(null);
  const [userLoading, setUserLoading] = React.useState(true);
  const [userError, setUserError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserApi();
        setUser(userData.user);
      } catch (err) {
        setUserError('You should be authorised');
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (user && !hasLoadedOnce) {
      dispatch(fetchUserOrders());
    }

    const id = setInterval(() => dispatch(fetchUserOrders()), 15000);
    return () => clearInterval(id);
  }, [dispatch, hasLoadedOnce, user]);

  if (userLoading) return <Preloader />;
  if (userError) return <main className='p-10'>{userError}</main>;

  if (isLoading && !hasLoadedOnce) return <Preloader />;
  if (error) return <main className='p-10'>Ошибка: {error}</main>;

  return (
    <ProtectedRoute>
      <ProfileOrdersUI orders={orders} onOrderClick={onOrderClick} />
    </ProtectedRoute>
  );
};
