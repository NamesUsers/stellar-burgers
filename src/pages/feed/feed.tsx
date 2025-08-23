import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchFeeds } from '../../services/slices/feedSlice';
import type { RootState } from '../../services/store';

import { TOrder } from '@utils-types';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();

  const orders: TOrder[] = useAppSelector((s: RootState) => s.feed.orders);
  const isLoading = useAppSelector((s: RootState) => s.feed.isLoading);
  const hasLoadedOnce = useAppSelector((s: RootState) => s.feed.hasLoadedOnce);

  useEffect(() => {
    if (!hasLoadedOnce) {
      dispatch(fetchFeeds());
    }
    const id = setInterval(() => {
      dispatch(fetchFeeds());
    }, 60000);

    return () => clearInterval(id);
  }, [dispatch, hasLoadedOnce]);

  if (isLoading && !hasLoadedOnce) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
