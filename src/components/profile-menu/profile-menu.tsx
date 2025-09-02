import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../services/store';
import { logout } from '../../services/slices/authSlice'; // Экшен для выхода из системы
import { ProfileMenuUI } from '@ui'; // Импортируем компонент UI для меню профиля

export const ProfileMenu: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Логика для выхода из аккаунта
  const handleLogout = async () => {
    try {
      // Вызываем экшен logout для очистки токенов и сброса состояния
      await dispatch(logout()).unwrap();

      // После успешного выхода, перенаправляем на страницу входа
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error); // Логирование ошибки, если выход не удался
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
