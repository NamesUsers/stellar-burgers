import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const userName = useAppSelector((s) => s.auth.user?.name || '');
  return <AppHeaderUI userName={userName} />;
};
