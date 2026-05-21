import { ConfigProvider } from "antd";
import ruRu from "antd/locale/ru_RU";
import { configureStore } from "@reduxjs/toolkit";
import { render, type RenderOptions } from "@testing-library/react";
import type { PropsWithChildren, ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { antdTheme, appStyledTheme } from "../theme";
import { authSlice, type AuthState } from "../store/auth-slice";

type TestAuthState = Partial<AuthState>;

type Options = Omit<RenderOptions, "wrapper"> & {
  auth?: TestAuthState;
  router?: MemoryRouterProps;
};

export function renderWithProviders(ui: ReactElement, options: Options = {}) {
  const { auth, router, ...renderOptions } = options;

  const store = configureStore({
    reducer: { auth: authSlice.reducer },
    preloadedState: {
      auth: { userId: auth?.userId ?? null },
    },
  });

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={appStyledTheme}>
          <ConfigProvider locale={ruRu} theme={antdTheme}>
            <MemoryRouter {...router}>{children}</MemoryRouter>
          </ConfigProvider>
        </ThemeProvider>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
