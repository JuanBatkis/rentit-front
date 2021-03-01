import React from 'react'
import { useAuthInfo } from "../hooks/authContext"
import {Form, Typography, Col, Row, Button, Input} from 'antd'
import { Gradient } from 'react-gradient'
import '../styles/auth.scss'

const { Title } = Typography

function Login() {
  const [form] = Form.useForm()
  const { login } = useAuthInfo()

  function handleSubmit(userInfo) {
    login(userInfo)
  }

  return (
    <Row justify="center" align="middle" className="main-row">
      <Col xs={22} sm={18} md={14} lg={10} xl={6} xxl={5}>
        <Gradient
          gradients={[
            ['#00a1ba ', '#9cd873 '],
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
          <Button type='primary' htmlType='submit' block size='large'>
            Login
          </Button>
        </Form>
      </Col>
    </Row>
  )
}

export default Login
