import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: Record<string, string> = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан',
  canceled: 'Отменён',
  cancelled: 'Отменён'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '';
  switch (status) {
    case 'pending':
      textStyle = '#E52B1A';
      break;
    case 'done':
      textStyle = '#00CCCC';
      break;
    default:
      textStyle = '#F2F2F3';
  }

  // ВАЖНО: текст берём по статусу, а не по цвету
  return (
    <OrderStatusUI textStyle={textStyle} text={statusText[status] ?? ''} />
  );
};
