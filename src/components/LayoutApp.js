import CustomHeader from './CustomHeader'
import { Layout } from 'antd'

const { Header, Content, Footer } = Layout

const LayoutApp = ({children}) => {
  return (
    <Layout className="layout">
      <Header>
        <CustomHeader />
      </Header>
      <Content>
        <div className="site-layout-content">
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>RENTIT ©2020 Created by <a href="https://github.com/JuanBatkis" target="_blank">Juan Batkis <span style={{fontSize: '1.2em'}}>👋</span></a></Footer>
    </Layout>
  )
}

export default LayoutApp
