import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { register as registerThunk } from '../../services/slices/authSlice';

export const Register: FC = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((s) => s.auth);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // регистрация + установка токенов; редирект выполнит ProtectedRoute (onlyUnAuth)
    dispatch(registerThunk({ name: userName, email, password }));
  };

  return (
    <RegisterUI
      errorText={error || undefined}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
