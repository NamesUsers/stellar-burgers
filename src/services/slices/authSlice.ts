import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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

// --- checkAuth: не звоним на /auth/user, если нет токенов
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    const access = getCookie('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    if (!access && !refresh) {
      return rejectWithValue('No tokens');
    }
    try {
      const resp = await getUserApi();
      return resp.user as { name: string; email: string };
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Auth check failed');
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
      // сохраняем токены!
      setCookie('accessToken', resp.accessToken); // "Bearer ..."
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
      // сохраняем токены!
      setCookie('accessToken', resp.accessToken); // "Bearer ..."
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
      // чистим токены!
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
    authChecked(state) {
      state.isAuthChecked = true;
      state.error = null;
    },
    setUser(state, action: PayloadAction<TUser>) {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthChecked = true; // завершили проверку, даже если 401/No tokens
        state.error = (action.payload as string) || 'Auth check failed';
      })
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
        state.error = (action.payload as string) || 'Login failed';
      })
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
        state.error = (action.payload as string) || 'Register failed';
      })
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
        state.error = (action.payload as string) || 'Update failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      });
  }
});

export const { authChecked, setUser } = slice.actions;
export default slice.reducer;
