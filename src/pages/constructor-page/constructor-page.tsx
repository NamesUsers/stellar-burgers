import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchIngredients,
  selectIngredientsLoading,
  selectIngredientsError,
  selectIngredients
} from '../../services/slices/ingredientsSlice';

import styles from './constructor-page.module.css';
import { BurgerIngredients, BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';

const ConstructorPage: FC = () => (
  <div className={styles.containerMain} key='3'>
    <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
      Соберите бургер
    </h1>
    <div className={`${styles.main} pl-5 pr-5`}>
      <BurgerIngredients />
      <BurgerConstructor />
    </div>
  </div>
);

export default ConstructorPage;
