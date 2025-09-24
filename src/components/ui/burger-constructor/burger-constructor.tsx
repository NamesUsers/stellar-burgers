import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal
}) => {
  // Проверяем, можно ли оформить заказ (должна быть булка)
  const canMakeOrder = !!constructorItems.bun;

  return (
    <section className={styles.burger_constructor} data-cy='burger-constructor'>
      {constructorItems.bun ? (
        <div className={`${styles.element} mb-4 mr-4`} data-cy='bun-top'>
          <ConstructorElement
            type='top'
            isLocked
            text={`${constructorItems.bun.name} (верх)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
          data-cy='no-bun-top'
        >
          Выберите булки
        </div>
      )}

      <ul className={styles.elements} data-cy='ingredients-list'>
        {constructorItems.ingredients.length > 0 ? (
          constructorItems.ingredients.map(
            (item: TConstructorIngredient, index: number) => (
              <div data-cy={`ingredient-${item.id}`} key={item.id}>
                <BurgerConstructorElement
                  ingredient={item}
                  index={index}
                  totalItems={constructorItems.ingredients.length}
                />
              </div>
            )
          )
        ) : (
          <div
            className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
            data-cy='no-ingredients'
          >
            Выберите начинку
          </div>
        )}
      </ul>

      {constructorItems.bun ? (
        <div className={`${styles.element} mt-4 mr-4`} data-cy='bun-bottom'>
          <ConstructorElement
            type='bottom'
            isLocked
            text={`${constructorItems.bun.name} (низ)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
          data-cy='no-bun-bottom'
        >
          Выберите булки
        </div>
      )}

      <div className={`${styles.total} mt-10 mr-4`} data-cy='total-price'>
        <div className={`${styles.cost} mr-10`}>
          <p className={`text ${styles.text} mr-2`} data-cy='price-value'>
            {price}
          </p>
          <CurrencyIcon type='primary' />
        </div>
        <Button
          htmlType='button'
          type='primary'
          size='large'
          onClick={onOrderClick}
          disabled={!canMakeOrder} // Блокируем кнопку если нет булки
          data-cy='order-button'
        >
          Оформить заказ
        </Button>
      </div>

      {orderRequest && (
        <Modal
          onClose={closeOrderModal}
          title={'Оформляем заказ...'}
          data-cy='order-modal-loading'
        >
          <Preloader />
        </Modal>
      )}

      {orderModalData && (
        <Modal
          onClose={closeOrderModal}
          title={orderRequest ? 'Оформляем заказ...' : ''}
          data-cy='order-modal-details'
        >
          <OrderDetailsUI orderNumber={orderModalData.number} />
        </Modal>
      )}
    </section>
  );
};
