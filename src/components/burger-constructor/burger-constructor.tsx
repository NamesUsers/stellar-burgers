import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  clearConstructor,
  removeIngredient
} from '../../services/slices/constructorSlice'; // Добавляем экшен removeIngredient
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // auth
  const user = useAppSelector((s) => s.auth.user);

  // constructor
  const bun = useAppSelector((s) => s.burgerConstructor.bun);
  const ingredients = useAppSelector(
    (s) => s.burgerConstructor.ingredients
  ) as TConstructorIngredient[];

  // order state
  const orderRequest = useAppSelector((s) => s.order.isLoading);
  const orderNumber = useAppSelector((s) => s.order.orderNumber);

  // что отдаём в UI
  const constructorItems = useMemo(
    () => ({
      bun: bun ?? null,
      ingredients
    }),
    [bun, ingredients]
  );

  // UI ждёт TOrder | null — сформируем минимальный объект с номером
  const orderModalData: TOrder | null = useMemo(() => {
    if (!orderNumber) return null;
    const now = new Date().toISOString();
    return {
      _id: '',
      status: 'created',
      name: '',
      createdAt: now,
      updatedAt: now,
      number: orderNumber,
      ingredients: []
    };
  }, [orderNumber]);

  const onOrderClick = async () => {
    // Требуется авторизация
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    // Нужна булка и хотя бы одна начинка/соус
    if (!constructorItems.bun || constructorItems.ingredients.length === 0) {
      return;
    }
    if (orderRequest) return;

    // Собираем ids: булка дважды (top/bottom) + остальные
    const ids: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];

    try {
      await dispatch(createOrder(ids)).unwrap();
      // По ТЗ: после успешного заказа очищаем конструктор
      dispatch(clearConstructor());
      // Обновим ленту, чтобы «реалтайм» отразился
      dispatch(fetchFeeds());
    } catch {
      // Ошибка уже в слайсе; UI может показать сообщение
    }
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const fillingsPrice = constructorItems.ingredients.reduce(
      (s: number, v: TConstructorIngredient) => s + v.price,
      0
    );
    return bunPrice + fillingsPrice;
  }, [constructorItems]);

  // Функция для удаления ингредиента
  const handleRemoveIngredient = (ingredientId: string) => {
    dispatch(removeIngredient(ingredientId)); // Вызываем экшен удаления
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      handleRemoveIngredient={handleRemoveIngredient} // Передаем функцию в UI
    />
  );
};
