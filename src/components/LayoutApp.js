import { useState } from 'react';
import { Layout, Menu, Drawer, Button, Image } from 'antd'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout

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
        <div className="logo">
        <Image
          width={200}
          src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
          preview={false}
        />
        </div>
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
