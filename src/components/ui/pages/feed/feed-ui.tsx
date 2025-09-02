import { FC } from 'react';
import styles from './feed.module.css';

import { FeedUIProps } from './type';
import { OrdersList, FeedInfo } from '@components';

export const FeedUI: FC<FeedUIProps> = ({ orders, handleGetFeeds }) => (
  <main className={styles.containerMain}>
    <div className={styles.titleBox}>
      <h1 className='text text_type_main-large'>Лента заказов</h1>

      {/* гибкий спейсер, чтобы кнопка уехала вправо */}
      <div style={{ flex: 1 }} />

      <button
        type='button'
        onClick={handleGetFeeds}
        // «текстовый» вид, без системных стилей кнопки
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer'
        }}
        className='text text_type_main-default text_color_inactive'
        aria-label='Обновить ленту заказов'
      >
        Обновить
      </button>
    </div>

    <div className={styles.main}>
      <section className={styles.columnOrders}>
        <OrdersList orders={orders} />
      </section>

      <aside className={styles.columnInfo}>
        <FeedInfo />
      </aside>
    </div>
  </main>
);
