import { FC, useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '../app-header/app-header';

import ConstructorPage from '../../pages/constructor-page/constructor-page';
import { Feed } from '../../pages/feed/feed';
import { Login } from '../../pages/login/login';
import { Register } from '../../pages/register/register';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { ResetPassword } from '../../pages/reset-password/reset-password';
import { Profile } from '../../pages/profile/profile';
import { ProfileOrders } from '../../pages/profile-orders/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404/not-fount-404';

import ProtectedRoute from '../protected-route/protected-route';

import { Modal } from '../modal/modal';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { OrderInfo } from '../order-info/order-info';

import { useAppDispatch, useAppSelector } from '../../services/store';
import { checkAuth } from '../../services/slices/authSlice';

import {
  fetchIngredients,
  selectIngredientsLoading,
  selectIngredientsError,
  selectIngredients
} from '../../services/slices/ingredientsSlice';

type TLocationState = { background?: { pathname: string } };

const App: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderModalNumber, setOrderModalNumber] = useState<string | null>(null);

  // Получаем состояние авторизации
  const { isAuthChecked, user } = useAppSelector((s) => s.auth);
  const isLoading = useAppSelector(selectIngredientsLoading);
  const error = useAppSelector(selectIngredientsError);
  const ingredients = useAppSelector(selectIngredients);

  useEffect(() => {
    // Просто вызываем checkAuth - он сам установит флаги
    dispatch(checkAuth());
    dispatch(fetchIngredients());

    // Восстанавливаем состояние модального окна из localStorage
    const savedModalState = localStorage.getItem('orderModalOpen');
    const savedOrderNumber = localStorage.getItem('lastOpenedOrder');

    if (savedModalState === 'true' && savedOrderNumber) {
      setOrderModalNumber(savedOrderNumber);
    }
  }, [dispatch]);

  // Восстанавливаем модальное окно после проверки авторизации
  useEffect(() => {
    if (isAuthChecked && orderModalNumber) {
      setIsOrderModalOpen(true);

      // Если пользователь авторизован и мы не на странице заказов, навигируем к ней
      if (user && !location.pathname.includes('/profile/orders')) {
        navigate(`/profile/orders/${orderModalNumber}`, {
          state: { background: location },
          replace: true
        });
      }
    }
  }, [isAuthChecked, orderModalNumber, user, location, navigate]);

  useEffect(() => {
    // Сохраняем состояние модального окна в localStorage
    if (isOrderModalOpen && orderModalNumber) {
      localStorage.setItem('orderModalOpen', 'true');
      localStorage.setItem('lastOpenedOrder', orderModalNumber);
    } else {
      localStorage.removeItem('orderModalOpen');
      localStorage.removeItem('lastOpenedOrder');
    }
  }, [isOrderModalOpen, orderModalNumber]);

  const openOrderModal = (orderNumber: string) => {
    setIsOrderModalOpen(true);
    setOrderModalNumber(orderNumber);
    // Сохраняем текущий URL как background
    navigate(`/profile/orders/${orderNumber}`, {
      state: { background: location }
    });
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setOrderModalNumber(null);
    navigate(-1);
  };

  const closeModal = () => {
    navigate(-1);
  };

  // background для модалок
  const state = location.state as TLocationState | undefined;
  const background = state?.background;

  // Показываем общий лоадер пока не прошла проверка авторизации
  if (!isAuthChecked) {
    return (
      <div>
        <AppHeader />
        <div className='p-10'>
          <p className='text text_type_main-default'>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppHeader />
      {isLoading ? (
        <div className='p-10'>
          <p className='text text_type_main-default'>Загрузка ингредиентов…</p>
        </div>
      ) : error ? (
        <main className='p-10'>
          <h2 className='text text_type_main-large mb-6'>Ошибка загрузки</h2>
          <p className='text text_type_main-default' style={{ color: '#f33' }}>
            Не удалось получить список ингредиентов: {error}
          </p>
        </main>
      ) : ingredients.length > 0 ? (
        <>
          {/* Основные (полные) страницы; если есть background — показываем его как фон */}
          <Routes location={background || location}>
            {/* общие */}
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />

            {/* гостевые (только для неавторизованных) */}
            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            {/* защищённые */}
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders onOrderClick={openOrderModal} />
                </ProtectedRoute>
              }
            />

            {/* «полные» страницы по прямому переходу */}
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {/* Модальные маршруты рисуем ТОЛЬКО после успешной загрузки */}
          {background && (
            <Routes>
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингредиента' onClose={closeModal}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/feed/:number'
                element={
                  <Modal title='Детали заказа' onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute>
                    <Modal title='Детали заказа' onClose={closeModal}>
                      <OrderInfo />
                    </Modal>
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}

          {/* Модальное окно для заказов (сохраняется при обновлении) */}
          {isOrderModalOpen && orderModalNumber && (
            <Modal title='Детали заказа' onClose={closeOrderModal}>
              <OrderInfo orderNumber={orderModalNumber} />
            </Modal>
          )}
        </>
      ) : (
        <main className='p-10'>
          <p className='text text_type_main-default'>Нет ингредиентов</p>
        </main>
      )}
    </div>
  );
};

export default App;
