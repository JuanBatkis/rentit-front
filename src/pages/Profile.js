import { useState } from 'react'
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom'
import { updateAvatar, getCurrentUser } from "../services/auth"
import axios from "axios"
import Info from './profile-subroutes/Info'
import Rents from './profile-subroutes/Rents'
import Questions from './profile-subroutes/Questions'
import Products from './profile-subroutes/Products'
import AddProduct from './profile-subroutes/AddProduct'
import { useAuthInfo } from '../hooks/authContext'
import { Row, Col, Avatar, List, Button, Upload, message, notification } from 'antd'
import { UploadOutlined } from '@ant-design/icons';


const Profile = () => {
  const {path} = useRouteMatch()
  const {user} = useAuthInfo()
  const {setUser} = useAuthInfo()
  const [loading, setLoading] = useState(false)

  const sideMenu = [
    {title: 'User info', link: path},
    {title: 'My rents', link: `${path}/rents`},
    {title: 'My questions', link: `${path}/questions`},
    {title: 'My products', link: `${path}/products`}
  ]

  const handleUpload = async file => {
    try {
      setLoading(true)
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
      if (!isJpgOrPng) {
        return (notification['error']({
          message: 'Something went wrong',
          description: 'You can only upload a JPG/PNG/WEBP file!',
          duration: 5,
          style: {
            borderRadius: '20px'
          }
        }))
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return (notification['error']({
          message: 'Something went wrong',
          description: 'Image must smaller than 2MB!',
          duration: 5,
          style: {
            borderRadius: '20px'
          }
        }))
      }

      const fdata = new FormData()
      fdata.append("file", file)
      const cloudinaryApi = "https://api.cloudinary.com/v1_1/djv6xyyqp/image/upload"
      fdata.append("upload_preset", "rentit_avatar")
      const { data } = await axios.post(cloudinaryApi, fdata)
      await updateAvatar({avatar: data.secure_url})
      getSession()
      setLoading(false)
    } catch (error) {
      notification['error']({
        message: 'Something went wrong',
        description: error.response.data.message,
        duration: 5,
        style: {
          borderRadius: '20px'
        }
      })
    }
  }
  
  const getSession = async () => {
    try {
      const { data } = await getCurrentUser()
      if (data) {
        setUser(data)
      }
    } catch (error) {
      notification['error']({
        message: 'Something went wrong',
        description: error.response.data.message,
        duration: 5,
        style: {
          borderRadius: '20px'
        }
      })
    }
  }

  return (
    <Row gutter={[16, 16]} justify="center" className="main-row profile-row">
      <Col xs={24} md={8} xl={6}>
        <div className='profile-cont side-menu-cont'>
          {user.avatar ? (
            <div className='avatar-container'>
              <Avatar
                size={150}
                src={user.avatar}
                style={{cursor: 'pointer'}}
              />
              <Upload
                name='avatar'
                showUploadList={false}
                beforeUpload={handleUpload}
                className='upload-cont'
              >
                <Button icon={<UploadOutlined />} shape="circle" loading={loading} />
              </Upload>
            </div>
          ) : (
            <div className='avatar-container'>
              <Avatar
                size={150}
                style={{
                  background: 'linear-gradient(45deg, rgba(0,161,186,1) 0%, rgba(156,216,115,1) 100%)',
                }}
              >
                {`${user.firstName[0]}${user.lastName[0]}`}
              </Avatar>
              <Upload
                name='avatar'
                showUploadList={false}
                beforeUpload={handleUpload}
                className='upload-cont'
              >
                <Button icon={<UploadOutlined />} shape="circle" loading={loading} />
              </Upload>
            </div>
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
      <Col xs={24} md={16} xl={14}>
        <div className='profile-cont info-cont'>
          <Switch>
            <Route component={Info} path={path} exact />
            <Route component={Rents} path={`${path}/rents`} />
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
