import { ProfileUI } from '@ui-pages';
import {
  FC,
  SyntheticEvent,
  useEffect,
  useState,
  useMemo,
  ChangeEvent
} from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { updateUser } from '../../services/slices/authSlice';

type TFormState = {
  name: string;
  email: string;
  password: string;
};

export const Profile: FC = () => {
  const dispatch = useAppDispatch();

  // Берём актуальные данные пользователя из стора
  const user = useAppSelector((s) => s.auth.user);

  const [formValue, setFormValue] = useState<TFormState>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: ''
  });

  // Синхронизируем форму при изменении пользователя в сторе
  useEffect(() => {
    setFormValue((prev) => ({
      ...prev,
      name: user?.name ?? '',
      email: user?.email ?? ''
      // password оставляем как есть
    }));
  }, [user?.name, user?.email]);

  // Показывать кнопки "Сохранить/Отмена" только при отличиях (краткая форма без return {})
  const isFormChanged = useMemo(
    () =>
      formValue.name !== (user?.name ?? '') ||
      formValue.email !== (user?.email ?? '') ||
      formValue.password.length > 0,
    [formValue, user?.name, user?.email]
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged) return;

    // Norma API обновляет name/email; пароль здесь не отправляем
    dispatch(updateUser({ name: formValue.name, email: formValue.email }));

    // Очистим пароль локально
    setFormValue((prev) => ({ ...prev, password: '' }));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }) as TFormState);
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
