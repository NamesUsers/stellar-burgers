import { RefObject } from 'react';
import { TIngredient, TTabMode } from '@utils-types';

// src/components/ui/burger-ingredients/type.ts
export type BurgerIngredientsUIProps = {
  currentTab: TTabMode;
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  titleBunRef: React.RefObject<HTMLHeadingElement>;
  titleMainRef: React.RefObject<HTMLHeadingElement>;
  titleSaucesRef: React.RefObject<HTMLHeadingElement>;
  bunsRef: (node?: Element | null | undefined) => void;
  mainsRef: (node?: Element | null | undefined) => void;
  saucesRef: (node?: Element | null | undefined) => void;
  counters: Record<string, number>; // Добавляем 'counters'
  onTabClick: (val: string) => void;
  onBunClick: (ingredient: TIngredient) => void;
  onIngredientClick: (ingredient: TIngredient) => void;
};
