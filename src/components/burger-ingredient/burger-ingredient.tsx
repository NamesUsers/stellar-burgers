// src/components/burger-ingredient/burger-ingredient.tsx
import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BurgerIngredientUI } from '@ui';
import { addIngredient } from '../../services/slices/constructorSlice';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
