import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthInfo } from "../hooks/authContext"
//import {  } from '../services/auth'
import { Form, Col, Row, Button, Input, Divider, Typography } from 'antd'
import { Gradient } from 'react-gradient'
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons'
import '../styles/auth.scss'

const { Text } = Typography;

const Login = () => {
  const [form] = Form.useForm()
  const { login } = useAuthInfo()

  const handleSubmit = (userInfo) => {
    login(userInfo)
  }

  return (
    <Row justify="center" align="middle" className="main-row">
      <Col xs={22} sm={18} md={14} lg={10} xl={8} xxl={6}>
        <Gradient
          gradients={[
            ['#00a1ba', '#9cd873'],
          ]}
          property="text"
          element="h1"
          angle="45deg"
          className="text ant-typography"
        >
          Login
        </Gradient>
        <Form form={form} onFinish={handleSubmit} layout='vertical'>
          <Form.Item name='email' label='Email:'>
            <Input type='email' />
          </Form.Item>
          <Form.Item name='password' label='Password:'>
            <Input.Password />
          </Form.Item>
          <Button type='primary' htmlType='submit' block size='large' shape="round">
            Log me in!
          </Button>
        </Form>
        <Divider id="socialDivider">Or connect with</Divider>
        <Row justify="center" align="middle" className="socialLogin">
          <Col span={6} align="middle">
            <a href="http://localhost:3001/auth/google">
              <GoogleOutlined />
            </a>
          </Col>
          <Col span={6} align="middle">
            <a href="http://localhost:3001/auth/facebook">
              <FacebookOutlined />
            </a>
          </Col>
          <Col span={24} align="middle" className="changeAuth">
            <Text>
              Don't have an account? <Link to='/signup'>Sign up here!</Link>
            </Text>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Login
