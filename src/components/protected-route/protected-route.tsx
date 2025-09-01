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
  const { user, isAuthChecked } = useAppSelector((s) => s.auth);

  // Пока проверка авторизации не завершена - показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Для гостевых маршрутов (onlyUnAuth = true)
  if (onlyUnAuth && user) {
    // Пользователь авторизован, но пытается попасть на гостевой маршрут
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // Для защищенных маршрутов (onlyUnAuth = false)
  if (!onlyUnAuth && !user) {
    // Пользователь не авторизован - перенаправляем на логин, сохраняя откуда пришел
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
