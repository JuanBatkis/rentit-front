import { useAuthInfo } from '../hooks/authContext'
import { Row, Col, Avatar } from 'antd';

const Profile = () => {
  const {user} = useAuthInfo()

  return (
    <Row gutter={16} justify="center">
      <Col xs={8} xl={6}>
        {user.avatar ? (
          <Avatar
            size={64}
            src={user.avatar}
            style={{cursor: 'pointer'}}
          />
        ) : (
          <Avatar
            size={120}
            style={{
              background: 'rgb(0,161,186)',
              background: 'linear-gradient(45deg, rgba(0,161,186,1) 0%, rgba(156,216,115,1) 100%)',
              cursor: 'pointer'
            }}
          >
            {user.firstName[0]}{user.lastName[0]}
          </Avatar>
        )}
      </Col>
      <Col xs={16} xl={14} style={{backgroundColor: '#ff4'}}>col-12</Col>
    </Row>
  )
}

export default Profile
