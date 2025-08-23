import { FC, useState, useRef, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector, useDispatch } from 'react-redux';
import { BurgerIngredientsUI } from '@ui';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { TIngredient } from '../../utils/types';
import { addIngredient, setBun } from '../../services/slices/constructorSlice';

type TTab = 'bun' | 'main' | 'sauce';

const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectIngredients);
  const [currentTab, setCurrentTab] = useState<TTab>('bun');

  const buns = items.filter((i: TIngredient) => i.type === 'bun');
  const mains = items.filter((i: TIngredient) => i.type === 'main');
  const sauces = items.filter((i: TIngredient) => i.type === 'sauce');

  // Рефы для заголовков
  const titleBunRef = useRef<HTMLHeadingElement | null>(null);
  const titleMainRef = useRef<HTMLHeadingElement | null>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement | null>(null);

  // Контейнеры секций для наблюдения
  const [bunsRef, bunsInView] = useInView({ threshold: 0.2 });
  const [mainsRef, mainsInView] = useInView({ threshold: 0.2 });
  const [saucesRef, saucesInView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (bunsInView) setCurrentTab('bun');
    else if (mainsInView) setCurrentTab('main');
    else if (saucesInView) setCurrentTab('sauce');
  }, [bunsInView, mainsInView, saucesInView]);

  // Логика для добавления ингредиентов
  const onTabClick = (value: string) => {
    const v = value as TTab;
    setCurrentTab(v);
    const map: Record<TTab, React.RefObject<HTMLHeadingElement>> = {
      bun: titleBunRef,
      main: titleMainRef,
      sauce: titleSaucesRef
    };
    map[v].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Добавляем булку в конструктор
  const onBunClick = (ingredient: TIngredient) => {
    dispatch(setBun(ingredient)); // Устанавливаем булку
  };

  // Добавляем ингредиент в конструктор
  const onIngredientClick = (ingredient: TIngredient) => {
    dispatch(addIngredient(ingredient)); // Добавляем ингредиент
  };

  // Счётчики ингредиентов
  const counters = useMemo(() => {
    const map: Record<string, number> = {};

    // Булка считается как две половинки (top/bottom)
    if (buns.length > 0 && buns[0]._id) {
      map[buns[0]._id] = (map[buns[0]._id] ?? 0) + 2;
    }

    // Считаем остальные ингредиенты
    for (const item of mains) {
      map[item._id] = (map[item._id] ?? 0) + 1;
    }
    for (const item of sauces) {
      map[item._id] = (map[item._id] ?? 0) + 1;
    }

    return map;
  }, [buns, mains, sauces]);

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      counters={counters} // Передаем счётчики ингредиентов в UI
      onTabClick={onTabClick}
      onBunClick={onBunClick} // Обработчик клика по булке
      onIngredientClick={onIngredientClick} // Обработчик клика по ингредиенту
    />
  );
};

export default BurgerIngredients;
