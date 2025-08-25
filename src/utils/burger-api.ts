import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

// Базовый URL
const URL =
  (import.meta as any).env?.VITE_BURGER_API_URL ||
  (process as any).env?.BURGER_API_URL ||
  'https://norma.nomoreparties.space/api';

// Общая проверка ответа
const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T = {}> = { success: boolean } & T;

// ===== refresh + helper =====

type TRefreshResponse = TServerResponse<{
  accessToken: string; // приходит вместе с "Bearer ..."
  refreshToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((data) => {
      if (!data.success) return Promise.reject(data);
      // сохраняем ВЕСЬ accessToken с "Bearer ..."
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    });

export const fetchWithRefresh = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const token = getCookie('accessToken'); // уже с "Bearer ..."
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        ...(options.headers as Record<string, string>),
        ...(token ? { authorization: token } : {})
      }
    });
    return await checkResponse<T>(res);
  } catch (err: any) {
    if (err?.message === 'jwt expired') {
      const { accessToken } = await refreshToken();
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          ...(options.headers as Record<string, string>),
          authorization: accessToken // тоже «как есть»
        }
      });
      return await checkResponse<T>(res);
    }
    return Promise.reject(err);
  }
};

// ===== ingredients =====

type TIngredientsResponse = TServerResponse<{ data: TIngredient[] }>;

export const getIngredientsApi = (): Promise<TIngredient[]> =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => (data.success ? data.data : Promise.reject(data)));

// ===== feeds / orders =====

type TFeedsResponse = TServerResponse<TOrdersData>;
type TOrdersResponse = TServerResponse<{ orders: TOrder[] }>;
type TNewOrderResponse = TServerResponse<{ order: TOrder }>;

// Отправка заказа с правильным порядковым номером
export const orderBurgerApi = (ingredients: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    body: JSON.stringify({ ingredients })
  }).then((data) => {
    if (data.success && data.order && data.order.number) {
      return { orderNumber: data.order.number }; // Возвращаем только порядковый номер
    }
    return Promise.reject(data);
  });

export const getFeedsApi = (): Promise<TOrdersData> =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => (data.success ? data : Promise.reject(data)));

export const getOrdersApi = (): Promise<TOrder[]> =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`).then((data) =>
    data.success ? data.orders : Promise.reject(data)
  );

export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  }).then((res) => checkResponse<TOrdersResponse>(res));

// ===== auth =====

export type TRegisterData = { email: string; name: string; password: string };
export type TLoginData = { email: string; password: string };

type TAuthResponse = TServerResponse<{
  accessToken: string; // с "Bearer ..."
  refreshToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  }).then((res) => checkResponse<TAuthResponse>(res));

export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  }).then((res) => checkResponse<TAuthResponse>(res));

export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
  }).then((res) => checkResponse<TServerResponse>(res));

export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  }).then((res) => checkResponse<TServerResponse>(res));

export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  }).then((res) => checkResponse<TServerResponse>(res));

// ===== user =====

type TUserResponse = TServerResponse<{ user: TUser }>;

// Получаем данные пользователя
export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, { method: 'GET' });

// Обновляем данные пользователя
export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    body: JSON.stringify(user)
  });

// алиасы
export const loginApi = loginUserApi;
export const registerApi = registerUserApi;
