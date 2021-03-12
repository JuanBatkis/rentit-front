import { Switch, Route, useRouteMatch, Link } from 'react-router-dom'
import Info from './profile-subroutes/Info'
import Questions from './profile-subroutes/Questions'
import Products from './profile-subroutes/Products'
import AddProduct from './profile-subroutes/AddProduct'
import { useAuthInfo } from '../hooks/authContext'
import { Row, Col, Avatar, List, Button } from 'antd'


const Profile = () => {
  const {path} = useRouteMatch()
  const {user} = useAuthInfo()

  const sideMenu = [
    {title: 'User info', link: path},
    {title: 'My rents', link: `${path}/rents`},
    {title: 'My questions', link: `${path}/questions`},
    {title: 'My products', link: `${path}/products`}
  ]

  return (
    <Row gutter={16} justify="center" className="main-row profile-row">
      <Col xs={8} xl={6}>
        <div className='profile-cont side-menu-cont'>
          {user.avatar ? (
            <Avatar
              size={150}
              src={user.avatar}
              style={{cursor: 'pointer'}}
            />
          ) : (
            <Avatar
              size={150}
              style={{
                background: 'rgb(0,161,186)',
                background: 'linear-gradient(45deg, rgba(0,161,186,1) 0%, rgba(156,216,115,1) 100%)',
                cursor: 'pointer'
              }}
            >
              {`${user.firstName[0]}${user.lastName[0]}`}
            </Avatar>
          )}
          <List
            size="small"
            dataSource={sideMenu}
            renderItem={item => (
              <List.Item>
                <Button type="text" size="large">
                  <Link to={item.link}>{item.title}</Link>
                </Button>
              </List.Item>
            )}
          />
        </div>
      </Col>
      <Col xs={16} xl={14}>
        <div className='profile-cont info-cont'>
          <Switch>
            <Route component={Info} path={path} exact />
            <Route component={() => 'Rents'} path={`${path}/rents`} />
            <Route component={Questions} path={`${path}/questions`} />
            <Route component={Products} path={`${path}/products`} exact />
            <Route component={AddProduct} path={`${path}/products/add`} />
          </Switch>
        </div>
      </Col>
    </Row>
  )
}

export default Profile
