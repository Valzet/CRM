import { configureStore, createSlice } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { crmApi } from "./api/crmApi";
import { authSlice } from "./auth-slice";

/** Заготовка корня Redux; добавляйте сюда слайсы по мере их появления. */
const appSlice = createSlice({
  name: "app",
  initialState: {} as Record<string, never>,
  reducers: {},
});

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    auth: authSlice.reducer,
    [crmApi.reducerPath]: crmApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(crmApi.middleware, authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
