import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthInfo } from '../hooks/authContext'
import { Menu, Drawer, Button, Row, Col, Tooltip, Avatar, Popover, Modal, Input } from 'antd'
import { MenuOutlined, PlusOutlined, ShoppingCartOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { Search } = Input;

const CustomHeader = () => {
  const {user, logout} = useAuthInfo()
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [visiblePopover, setVisiblePopover] = useState(false)
  const { confirm } = Modal

  const showDrawer = () => {
    setVisibleDrawer(true)
  }
  const closeDrawer = () => {
    setVisibleDrawer(false)
  }

  const showPopover = visible => {
    setVisiblePopover(visible)
  }

  const showConfirm = () => {
    setVisiblePopover(false)
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h3>Are you sure you want to log out?</h3>,
      maskClosable: true,
      onOk() {
        logout()
      }
    })
  }

  const onSearch = value => console.log(value)

  return (
    <Row justify="space-between"  align="middle">
      <Col span={4}>
        <Button type="text" onClick={showDrawer} size={'large'}>
          <MenuOutlined />
        </Button>
        <Drawer
          placement="left"
          closable={true}
          onClose={closeDrawer}
          visible={visibleDrawer}
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
      <Col span={4} align="right" style={{display: 'flex'}}>
        {/* <Tooltip placement="bottom" title={'Cart'}>
          <Link to='/cart'>
            <ShoppingCartOutlined style={{fontSize: '1.6em', color: 'rgba(0, 0, 0, 0.85)', marginRight: '20px'}} />
          </Link>
        </Tooltip> */}
        <Search placeholder="input search text" allowClear onSearch={onSearch} style={{ width: 'calc(100% - 32px)', paddingRight: '10px' }} />
        {user ? (
          <Popover 
            placement="bottomRight" 
            title={<span>{`${user.firstName}  ${user.lastName}`}</span>} 
            content={
              <>
                <Button  type="text">
                  <Link to='/profile'>Profile</Link>
                </Button>
                <br/>
                <Button  type="text" onClick={showConfirm}>
                  Log out
                </Button>
              </>
            } 
            trigger="click"
            visible={visiblePopover}
            onVisibleChange={showPopover}
          >
            {user.avatar ? (
              <Avatar
                src={user.avatar}
                style={{cursor: 'pointer'}}
              />
            ) : (
              <Avatar
                style={{
                  background: 'rgb(0,161,186)',
                  background: 'linear-gradient(45deg, rgba(0,161,186,1) 0%, rgba(156,216,115,1) 100%)',
                  cursor: 'pointer'
                }}
              >
                {user.firstName[0]}{user.lastName[0]}
              </Avatar>
            )}
          </Popover>
        ) : (
          <Tooltip placement="bottom" title={'Login/Signup'}>
            <Link to='/login' style={{display: 'flex', alignItems: 'center'}}>
              <UserOutlined style={{fontSize: '1.6em', color: 'rgba(0, 0, 0, 0.85)'}} />
            </Link>
          </Tooltip>
        )}
      </Col>
    </Row>
  )
}

export default CustomHeader
