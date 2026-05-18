import { Link } from 'react-router-dom'
import { path, Page } from '../../lib/constants/navigation'
import { PlaceholderPage } from '../placeholder-page'

export function UnavailablePage() {
  return (
    <PlaceholderPage
      title='Сервис недоступен'
      description='Сервис временно недоступен. Попробуйте позже.'
    >
      <Link to={Page.MAIN}>На главную</Link>
    </PlaceholderPage>
  )
}

export function NotFoundPage() {
  return (
    <PlaceholderPage
      title='Страница не найдена'
      description='Проверьте адрес или перейдите в раздел ниже.'
    >
      <Link to={path.welcome}>На главную</Link>
    </PlaceholderPage>
  )
}
