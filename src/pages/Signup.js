import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { signupFn } from "../services/auth"
import { Form, Col, Row, Button, Input, Divider, Typography, notification } from 'antd'
import { Gradient } from 'react-gradient'
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons'

const { Text } = Typography;

const Signup = () => {
  const [form] = Form.useForm()
  const {push} = useHistory()

  async function handleSubmit(userInfo) {
    try {
      await signupFn(userInfo)
      notification['success']({
        message: 'Account created!',
        description: `Hello ${userInfo.firstName} 👋. Please check your email to verify your account`,
        duration: 5,
        style: {
          borderRadius: '20px'
        }
      })
      push('/login')
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
    <Row justify="center" align="middle" className="main-row auth-cont">
      <Col xs={22} sm={18} md={14} lg={10} xl={8} xxl={6}>
        <div>
          <Gradient
            gradients={[
              ['#00a1ba', '#9cd873'],
            ]}
            property="text"
            element="h1"
            angle="45deg"
            className="text ant-typography"
          >
            Sign up
          </Gradient>
          <Form form={form} onFinish={handleSubmit} layout='vertical'>
            <Form.Item name='email' label='Email:'>
              <Input type='email' />
            </Form.Item>
            <Row gutter={6}>
              <Col span={12}>
                <Form.Item name='firstName' label='First name:'>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='lastName' label='Last name:'>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name='storeName' label='Store name:'>
              <Input />
            </Form.Item>
            <Form.Item name='phone' label='Phone:'>
              <Input />
            </Form.Item>
            <Form.Item name='password' label='Password:'>
              <Input.Password />
            </Form.Item>
            <Form.Item name='confirmPassword' label='Confirm password:'>
              <Input.Password />
            </Form.Item>
            <Button type='primary' htmlType='submit' block size='large' shape="round">
              Sign me up!
            </Button>
          </Form>
          <Divider id="socialDivider">Or connect with</Divider>
          <Row justify="center" align="middle" className="socialLogin">
            <Col span={6} align="middle">
              <a href="/api/auth/google">
                <GoogleOutlined />
              </a>
            </Col>
            {/* <Col span={6} align="middle">
              <a href="/api/auth/facebook">
                <FacebookOutlined />
              </a>
            </Col> */}
            <Col span={24} align="middle" className="changeAuth">
              <Text>
                Already have an account? <Link to='/login'>Log in here!</Link>
              </Text>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )
}

export default Signup
