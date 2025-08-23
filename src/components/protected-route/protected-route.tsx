import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { Preloader } from '../ui';

type Props = {
  onlyUnAuth?: boolean;
  children: ReactNode;
};

const ProtectedRoute: FC<Props> = ({ onlyUnAuth = false, children }) => {
  const location = useLocation();
  const { user, isAuthChecked, loading } = useAppSelector((s) => s.auth);

  // пока идёт начальная проверка – показываем прелоадер
  if (!isAuthChecked || loading) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    // если авторизован, перенаправляем на страницу, с которой он пытался попасть
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    // если не авторизован, перенаправляем на страницу логина
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
