// src/components/ui/app-header/app-header.tsx
import React, { FC } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  const background = (location.state as any)?.background;
  const pathname = (background || location).pathname as string;

  const isConstructorActive =
    pathname === '/' || pathname.startsWith('/ingredients');
  const isFeedActive = pathname.startsWith('/feed');
  const isProfileActive = pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      {' '}
      {/* Шапка будет фиксированной */}
      <nav className={clsx(styles.menu, 'p-4')}>
        <div className={styles.menu_part_left}>
          <NavLink to='/' end className={styles.link}>
            <span
              className={styles.link}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <BurgerIcon
                type={isConstructorActive ? 'primary' : 'secondary'}
              />
              <span
                className={clsx(
                  'text text_type_main-default ml-2 mr-10',
                  !isConstructorActive && 'text_color_inactive'
                )}
              >
                Конструктор
              </span>
            </span>
          </NavLink>

          <NavLink to='/feed' className={styles.link}>
            <span
              className={styles.link}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
              <span
                className={clsx(
                  'text text_type_main-default ml-2',
                  !isFeedActive && 'text_color_inactive'
                )}
              >
                Лента заказов
              </span>
            </span>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <Link to='/' aria-label='На главную'>
            <Logo className='' />
          </Link>
        </div>

        <div className={styles.link_position_last}>
          <NavLink to='/profile' className={styles.link}>
            <span
              className={styles.link}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
              <span
                className={clsx(
                  'text text_type_main-default ml-2',
                  !isProfileActive && 'text_color_inactive'
                )}
              >
                {userName || 'Личный кабинет'}
              </span>
            </span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
