import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { verifyFn } from "../services/auth"
import { Col, Row, Button, Typography, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Gradient } from 'react-gradient'

const { Paragraph } = Typography;

const antIcon = <LoadingOutlined style={{ fontSize: 40, color: '#5dbe8c' }} spin />

const Activate = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState(null)

  const verifyUser = async (userId) => {
    try {
      const { data } = await verifyFn({id: userId})
      setUserName(data.firstName)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    verifyUser(id)
  }, [])

  return (
    <Row justify="center" align="middle" className="main-row auth-cont">
      <Col xs={22} sm={18} md={14} lg={10} xl={8} xxl={6}>
        <div>
          {loading ? (
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Spin indicator={antIcon} />
            </div>
          ) : (
            <>
              <Gradient
                gradients={[
                  ['#00a1ba', '#9cd873'],
                ]}
                property="text"
                element="h1"
                angle="45deg"
                className="text ant-typography"
              >
                Hello {userName}!
              </Gradient>
              <Paragraph>
                Your account has been successfully activated!
              </Paragraph>
              <Paragraph>
                You can now proceed to login and start taking advantage of every feature of our platform!
              </Paragraph>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <Button type="primary" size={'large'} shape="round" style={{height: 'auto', padding: '6px 30px'}}>
                  <Link to='/login' style={{color: '#fff', fontSize: '1.5em'}}>Log in!</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </Col>
    </Row>
  )
}

export default Activate
