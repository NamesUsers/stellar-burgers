import { FC } from 'react';

import styles from './profile-orders.module.css';

import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({
  orders,
  onOrderClick
}) => {
  // Добавляем data-атрибуты к заказам для обработки кликов
  const ordersWithClickData = orders.map((order) => ({
    ...order,
    // Добавляем data-атрибут для идентификации заказа
    _id: order._id // оставляем как есть, но можно добавить метку
  }));

  return (
    <main className={styles.main} aria-labelledby='profile-orders-title'>
      <div
        className={`mt-30 mr-15 ${styles.menu}`}
        role='navigation'
        aria-label='Меню профиля'
      >
        <ProfileMenu />
      </div>

      <div className={`mt-10 ${styles.orders}`}>
        <h1
          id='profile-orders-title'
          className='text text_type_main-large mb-6'
        >
          История заказов
        </h1>

        {orders.length > 0 ? (
          <div
            onClick={(e) => {
              // Находим элемент заказа по которому кликнули
              const orderElement = (e.target as HTMLElement).closest(
                '[data-order-number]'
              );
              if (orderElement && onOrderClick) {
                const orderNumber =
                  orderElement.getAttribute('data-order-number');
                if (orderNumber) {
                  onOrderClick(orderNumber);
                }
              }
            }}
          >
            <OrdersList
              orders={ordersWithClickData}
              data-testid='orders-list'
            />
          </div>
        ) : (
          <section
            className='pt-10 pb-10'
            aria-live='polite'
            data-testid='orders-empty'
          >
            <p className='text text_type_main-default text_color_inactive mb-4'>
              История заказов пуста.
            </p>
            <p className='text text_type_main-default text_color_inactive'>
              Оформите первый заказ в конструкторе — он появится здесь.
            </p>
          </section>
        )}
      </div>
    </main>
  );
};
