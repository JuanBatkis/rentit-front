import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthInfo } from '../hooks/authContext'
import { Menu, Drawer, Button, Row, Col, Tooltip, Avatar, Popover, Modal } from 'antd'
import { MenuOutlined, PlusOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Gradient } from 'react-gradient'

const CustomHeader = ({push}) => {
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
    showPopover(false)
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h3>Are you sure you want to log out?</h3>,
      maskClosable: true,
      onOk() {
        logout(push)
      }
    })
  }

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
          <Gradient
              gradients={[
                ['#00a1ba', '#9cd873'],
              ]}
              property="text"
              element="h2"
              angle="45deg"
              className="text ant-typography"
              style={{display: 'inline-block', padding:'0 16px', pointerEvents: 'none', userSelect: 'none'}}
            >
              Store
          </Gradient>
          <Menu theme="light">
            <Menu.Item key="1" onClick={closeDrawer}>
              <Link to='/products/all'>Products</Link>
            </Menu.Item>
            <Menu.ItemGroup>
              <Menu.Item key="2" onClick={closeDrawer}>
                <Link to='/products/tools'>Tools</Link>
              </Menu.Item>
              <Menu.Item key="3" onClick={closeDrawer}>
                <Link to='/products/technology'>Technology</Link>
              </Menu.Item>
              <Menu.Item key="4" onClick={closeDrawer}>
                <Link to='/products/vehicles'>Vehicles</Link>
              </Menu.Item>
              <Menu.Item key="5" onClick={closeDrawer}>
                <Link to='/products/sports'>Sports</Link>
              </Menu.Item>
              <Menu.Item key="6" onClick={closeDrawer}>
                <Link to='/products/other'>Other</Link>
              </Menu.Item>
            </Menu.ItemGroup>
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
        {user ? (
          <Popover 
            placement="bottomRight" 
            title={<span>{`${user.firstName}  ${user.lastName}`}</span>} 
            content={
              <>
                <Button  type="text" onClick={() => showPopover(false)}>
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
                  background: 'linear-gradient(45deg, rgba(0,161,186,1) 0%, rgba(156,216,115,1) 100%)',
                  cursor: 'pointer'
                }}
              >
                {`${user.firstName[0]}${user.lastName[0]}`}
              </Avatar>
            )}
          </Popover>
        ) : (
          <Tooltip placement="bottom" title={'Login/Signup'}>
            <Link to='/login' style={{alignItems: 'center'}}>
              <UserOutlined style={{fontSize: '1.6em', color: 'rgba(0, 0, 0, 0.85)'}} />
            </Link>
          </Tooltip>
        )}
      </Col>
    </Row>
  )
}

export default CustomHeader
