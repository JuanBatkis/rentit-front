import { useState } from 'react';
import { Layout, Menu, Drawer, Button, Typography, Row, Col } from 'antd'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout
const { Title } = Typography

function LayoutApp({children}) {

  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

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
            <Title>RENTIT</Title>
          </Col>
          <Col span={4} align="right">col-4</Col>
        </Row>
      </Header>
      <Content>
        <div className="site-layout-content">
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  )
}

export default LayoutApp
