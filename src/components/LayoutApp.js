import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu, Drawer, Button, Row, Col, Tooltip } from 'antd'
import { MenuOutlined, PlusOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = Layout

function LayoutApp({children}) {

  const [visible, setVisible] = useState(false)
  const showDrawer = () => {
    setVisible(true)
  }
  const onClose = () => {
    setVisible(false)
  }

  return (
    <Layout className="layout">
      <Header>
        <Row justify="space-between"  align="middle">
          <Col span={4}>
            <Button type="text" onClick={showDrawer} size={'large'}>
              <MenuOutlined />
            </Button>
            <Drawer
              placement="left"
              closable={true}
              onClose={onClose}
              visible={visible}
              closeIcon={<PlusOutlined rotate={45} />}
            >
              <Menu theme="light" defaultSelectedKeys={['2']}>
                <Menu.Item key="1">nav 1</Menu.Item>
                <Menu.Item key="2">nav 2</Menu.Item>
                <Menu.Item key="3">nav 3</Menu.Item>
              </Menu>
            </Drawer>
          </Col>
          <Col span={4} align="middle">
            <Link to='/'>
              <img
                alt="RENTIT"
                src="https://res.cloudinary.com/djv6xyyqp/image/upload/v1614452197/rentit/images/rentit-logoRecurso_8_1x_dc0e8o.png"
                style={{maxHeight: '44px'}}
              />
            </Link>
          </Col>
          <Col span={4} align="right">
            <Tooltip placement="bottom" title={'Cart'}>
              <Link to='/cart'>
                <ShoppingCartOutlined style={{fontSize: '1.6em', color: 'rgba(0, 0, 0, 0.85)', marginRight: '20px'}} />
              </Link>              
            </Tooltip>
            <Tooltip placement="bottom" title={'Login/Signup'}>
              <Link to='/login'>
                <UserOutlined style={{fontSize: '1.5em', color: 'rgba(0, 0, 0, 0.85)'}} />
              </Link>
            </Tooltip>
          </Col>
        </Row>
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
