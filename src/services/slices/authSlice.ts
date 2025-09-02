import {
  createSlice,
  createAsyncThunk,
  createAction,
  PayloadAction
} from '@reduxjs/toolkit';
import {
  getUserApi,
  loginApi,
  logoutApi,
  registerApi,
  updateUserApi
} from '../../utils/burger-api';
import { setCookie, getCookie } from '../../utils/cookie';

type TUser = { name: string; email: string } | null;

type AuthState = {
  user: TUser;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

// Синхронное действие для установки флага проверки
export const setIsAuthChecked = createAction<boolean>('auth/setIsAuthChecked');

// Проверка существования токенов
const isTokenExists = () => {
  const access = getCookie('accessToken');
  const refresh = localStorage.getItem('refreshToken');
  return !!(access || refresh);
};

// Упрощенный checkAuth по примеру наставника
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch }) => {
    if (isTokenExists()) {
      try {
        const resp = await getUserApi();
        dispatch(setUser(resp.user));
      } catch (error) {
        // Игнорируем ошибку - просто очищаем пользователя
        dispatch(setUser(null));
        // Очищаем невалидные токены
        setCookie('accessToken', '', { expires: -1 } as any);
        localStorage.removeItem('refreshToken');
      } finally {
        dispatch(setIsAuthChecked(true));
      }
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const resp = await loginApi({ email, password });
      setCookie('accessToken', resp.accessToken);
      localStorage.setItem('refreshToken', resp.refreshToken);
      return resp.user as { name: string; email: string };
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    {
      name,
      email,
      password
    }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const resp = await registerApi({ name, email, password });
      setCookie('accessToken', resp.accessToken);
      localStorage.setItem('refreshToken', resp.refreshToken);
      return resp.user as { name: string; email: string };
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Register failed');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (
    payload: { name?: string; email?: string; password?: string },
    { rejectWithValue }
  ) => {
    try {
      const resp = await updateUserApi(payload);
      return resp.user as { name: string; email: string };
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Update failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      setCookie('accessToken', '', { expires: -1 } as any);
      localStorage.removeItem('refreshToken');
      return true;
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Logout failed');
    }
  }
);

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser>) {
      state.user = action.payload;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // checkAuth - используем только finally через setIsAuthChecked
      .addCase(setIsAuthChecked, (state, action) => {
        state.isAuthChecked = action.payload;
      })
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { setUser, clearError } = slice.actions;
export default slice.reducer;
