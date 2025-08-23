import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Добавляем useLocation
import { LoginUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { login as loginThunk } from '../../services/slices/authSlice';

export const Login: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Получаем location
  const { error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Получаем из состояния маршрута путь, с которого был редирект
  const from = (location.state as { from: string })?.from || '/'; // Указываем тип состояния

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await dispatch(loginThunk({ email, password }));

    // Перенаправляем пользователя после успешного входа
    navigate(from);
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
