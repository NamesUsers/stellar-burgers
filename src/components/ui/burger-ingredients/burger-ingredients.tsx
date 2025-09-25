import React, { FC, memo } from 'react';
import { Tab } from '@zlden/react-developer-burger-ui-components';
import styles from './burger-ingredients.module.css';
import { BurgerIngredientsUIProps } from './type';
import { IngredientsCategory } from '@components';

export const BurgerIngredientsUI: FC<BurgerIngredientsUIProps> = memo(
  ({
    currentTab,
    buns,
    mains,
    sauces,
    titleBunRef,
    titleMainRef,
    titleSaucesRef,
    bunsRef,
    mainsRef,
    saucesRef,
    counters, // передаем counters
    onTabClick
  }) => (
    <>
      <section
        className={styles.burger_ingredients}
        data-cy='burger-ingredients'
      >
        <nav data-cy='ingredients-nav'>
          <ul className={styles.menu} data-cy='ingredients-menu'>
            <Tab
              value='bun'
              active={currentTab === 'bun'}
              onClick={onTabClick}
              data-cy='tab-buns'
            >
              Булки
            </Tab>
            <Tab
              value='main'
              active={currentTab === 'main'}
              onClick={onTabClick}
              data-cy='tab-mains'
            >
              Начинки
            </Tab>
            <Tab
              value='sauce'
              active={currentTab === 'sauce'}
              onClick={onTabClick}
              data-cy='tab-sauces'
            >
              Соусы
            </Tab>
          </ul>
        </nav>

        <div className={styles.content} data-cy='ingredients-content'>
          <IngredientsCategory
            title='Булки'
            titleRef={titleBunRef}
            ingredients={buns}
            ref={bunsRef}
            counters={counters}
            data-cy='ingredients-buns' // Добавлен атрибут для булок
          />
          <IngredientsCategory
            title='Начинки'
            titleRef={titleMainRef}
            ingredients={mains}
            ref={mainsRef}
            counters={counters}
            data-cy='ingredients-mains' // Добавлен атрибут для начинок
          />
          <IngredientsCategory
            title='Соусы'
            titleRef={titleSaucesRef}
            ingredients={sauces}
            ref={saucesRef}
            counters={counters}
            data-cy='ingredients-sauces' // Добавлен атрибут для соусов
          />
        </div>
      </section>
    </>
  )
);

export default BurgerIngredientsUI;
