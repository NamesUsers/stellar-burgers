// src/components/ingredients-category/ingredients-category.tsx
import { forwardRef, useMemo } from 'react';
import { useAppSelector } from '../../services/store';

import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import {
  selectBun,
  selectConstructorIngredients
} from '../../services/slices/constructorSlice'; // Селекторы для данных конструктора

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Получаем актуальные данные из стора
  const bun = useAppSelector(selectBun); // Берем булку из стора
  const constructorIngredients = useAppSelector(selectConstructorIngredients); // Берем остальные ингредиенты

  // Логика для подсчета ингредиентов
  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    // Если есть булка, считаем её как две половинки
    if (bun) counters[bun._id] = 2;

    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters} // Передаем ingredientsCounters в UI
      ref={ref}
    />
  );
});
