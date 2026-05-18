import styled from 'styled-components'
import { MainContent, ViewContainer } from '../layouts'
import { MainSidebar } from '../layouts/sidebar/main-sidebar'

const Shell = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
  min-height: 100dvh;
`

const MainPane = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
`

/** Оболочка: сайдбар YaPlex + область с {@link Outlet}. */
export function MainLayout() {
  return (
    <Shell>
      <MainSidebar />
      <MainPane>
        <MainContent>
          <ViewContainer />
        </MainContent>
      </MainPane>
    </Shell>
  )
}
