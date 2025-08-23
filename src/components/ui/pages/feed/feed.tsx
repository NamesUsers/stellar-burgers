import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { useAppDispatch, useAppSelector } from '../../../../services/store';
import { fetchFeeds } from '../../../../services/slices/feedSlice';
import { TOrder } from '@utils-types';

// Локальный импорт UI компонента вместо циклического импорта
import { FeedUI } from './feed-ui'; // Создайте этот файл

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const orders: TOrder[] = useAppSelector((state) => state.feed.orders);
  const isLoading = useAppSelector((state) => state.feed.isLoading);
  const hasLoadedOnce = useAppSelector((state) => state.feed.hasLoadedOnce);

  useEffect(() => {
    if (!hasLoadedOnce) dispatch(fetchFeeds());
    const interval = setInterval(() => {
      dispatch(fetchFeeds());
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, hasLoadedOnce]);

  if (isLoading && !hasLoadedOnce) return <Preloader />;

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
