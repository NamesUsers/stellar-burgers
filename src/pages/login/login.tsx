import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store'; // Исправлен импорт
import { login as loginThunk } from '../../services/slices/authSlice';

export const Login: FC = () => {
  const dispatch = useAppDispatch(); // Используем типизированный dispatch
  const navigate = useNavigate();
  const location = useLocation();

  const { error } = useAppSelector((s) => s.auth); // Используем типизированный selector
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Получаем из состояния маршрута путь, с которого был редирект
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: SyntheticEvent, returnPath: string) => {
    e.preventDefault();

    try {
      const result = await dispatch(loginThunk({ email, password })).unwrap();

      // Перенаправляем пользователя после успешного входа
      if (result) {
        navigate(returnPath, { replace: true });
      }
    } catch (error) {
      // Ошибка обрабатывается в slice и попадает в error
      console.log('Login error:', error);
    }
  };

  return (
    <LoginUI
      errorText={error || undefined}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
