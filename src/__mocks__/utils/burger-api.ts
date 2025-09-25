// src/__mocks__/utils/burger-api.ts
export const BURGER_API_URL = 'https://norma.nomoreparties.space/api';

// Базовые функции для запросов
const checkResponse = (res: Response) => {
  return res.ok ? res.json() : res.json().then((err) => Promise.reject(err));
};

const request = (url: string, options?: RequestInit) => {
  return fetch(url, options).then(checkResponse);
};

// Моки для API функций
export const getIngredientsApi = jest.fn().mockImplementation(() => {
  return request(`${BURGER_API_URL}/ingredients`);
});

export const createOrderApi = jest
  .fn()
  .mockImplementation((ingredients: string[], token?: string) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token })
      },
      body: JSON.stringify({ ingredients })
    };
    return request(`${BURGER_API_URL}/orders`, options);
  });

export const getUserApi = jest.fn().mockImplementation((token: string) => {
  return request(`${BURGER_API_URL}/auth/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  });
});

export const loginApi = jest
  .fn()
  .mockImplementation((email: string, password: string) => {
    return request(`${BURGER_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
  });

export const logoutApi = jest
  .fn()
  .mockImplementation((refreshToken: string) => {
    return request(`${BURGER_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: refreshToken })
    });
  });

export const registerApi = jest
  .fn()
  .mockImplementation((email: string, password: string, name: string) => {
    return request(`${BURGER_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, name })
    });
  });

export const updateUserApi = jest
  .fn()
  .mockImplementation(
    (
      userData: { email?: string; password?: string; name?: string },
      token: string
    ) => {
      return request(`${BURGER_API_URL}/auth/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(userData)
      });
    }
  );

export const refreshTokenApi = jest
  .fn()
  .mockImplementation((refreshToken: string) => {
    return request(`${BURGER_API_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: refreshToken })
    });
  });

export const resetPasswordApi = jest
  .fn()
  .mockImplementation((password: string, token: string) => {
    return request(`${BURGER_API_URL}/auth/password-reset/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password, token })
    });
  });

export const forgotPasswordApi = jest
  .fn()
  .mockImplementation((email: string) => {
    return request(`${BURGER_API_URL}/auth/password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
  });

// Экспорты для тестов
export default {
  BURGER_API_URL,
  getIngredientsApi,
  createOrderApi,
  getUserApi,
  loginApi,
  logoutApi,
  registerApi,
  updateUserApi,
  refreshTokenApi,
  resetPasswordApi,
  forgotPasswordApi,
  checkResponse,
  request
};
