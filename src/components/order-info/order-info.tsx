import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useAppSelector } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';

type TOrderData = {
  createdAt: string;
  ingredients: string[];
  _id: string;
  status: string;
  name: string;
  updatedAt: string;
  number: number;
};

interface OrderInfoProps {
  orderNumber?: string;
}

export const OrderInfo: FC<OrderInfoProps> = ({
  orderNumber: propOrderNumber
}) => {
  const { number } = useParams<{ number: string }>();
  // Используем переданный номер заказа или берем из URL
  const orderNumber = propOrderNumber
    ? parseInt(propOrderNumber, 10)
    : number
      ? parseInt(number, 10)
      : NaN;

  // Ингредиенты уже грузятся в App → берём из стора
  const ingredients = useAppSelector(
    (s) => s.ingredients.items
  ) as TIngredient[];

  const [orderData, setOrderData] = useState<TOrderData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Кэширование загруженных заказов
  const [ordersCache, setOrdersCache] = useState<Record<number, TOrderData>>(
    {}
  );

  // Загружаем заказ по номеру
  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        // Проверяем кэш
        if (ordersCache[orderNumber]) {
          setOrderData(ordersCache[orderNumber]);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setError(null);
        // В разных стартер-китах ответ /orders/:number отличается.
        // Приведём к одному заказу:
        const raw: any = await getOrderByNumberApi(orderNumber);
        const extracted: TOrderData | null = Array.isArray(raw)
          ? (raw[0] as TOrderData) ?? null
          : raw?.orders
            ? (raw.orders[0] as TOrderData) ?? null
            : (raw as TOrderData);

        if (!ignore) {
          if (extracted) {
            setOrderData(extracted);
            // Сохраняем в кэш
            setOrdersCache((prev) => ({ ...prev, [orderNumber]: extracted }));
          } else {
            setError('Заказ не найден');
          }
        }
      } catch (e: any) {
        if (!ignore) setError(e?.message ?? 'Не удалось загрузить заказ');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    if (!Number.isNaN(orderNumber)) {
      load();
    } else {
      setIsLoading(false);
      setError('Неверный номер заказа');
    }

    return () => {
      ignore = true;
    };
  }, [orderNumber, ordersCache]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Подсчёт вхождений через обычный объект (без Map)
    const counts: Record<string, number> = {};
    for (const id of orderData.ingredients) {
      counts[id] = (counts[id] ?? 0) + 1;
    }

    // Собираем объект с ингредиентами и корректируем булку (×2 если пришла один раз)
    const ingredientsInfo: TIngredientsWithCount = {};
    for (const [id, qty] of Object.entries(counts)) {
      const ingredient = ingredients.find((ing) => ing._id === id);
      if (!ingredient) continue;

      const count = ingredient.type === 'bun' && qty === 1 ? 2 : qty;

      ingredientsInfo[id] = {
        ...ingredient,
        count
      };
    }

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    // Показываем прелоадер либо если ещё грузится заказ/ингредиенты
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='p-10'>
        <p className='text text_type_main-default' style={{ color: 'red' }}>
          {error}
        </p>
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
