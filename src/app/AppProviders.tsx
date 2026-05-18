import { ConfigProvider } from 'antd'
import ruRu from 'antd/locale/ru_RU'
import type { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { store } from '../store'
import { antdTheme, GlobalStyle, appStyledTheme } from '../theme'

export function AppProviders(props: PropsWithChildren) {
  const { children } = props

  return (
    <ThemeProvider theme={appStyledTheme}>
      <Provider store={store}>
        <ConfigProvider locale={ruRu} theme={antdTheme}>
          <GlobalStyle />
          {children}
        </ConfigProvider>
      </Provider>
    </ThemeProvider>
  )
}
