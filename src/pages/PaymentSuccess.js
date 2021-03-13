import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { updateRent } from "../services/rents"
import { Col, Row, Button, Typography, Spin, notification } from 'antd'
import { LoadingOutlined, CheckOutlined } from '@ant-design/icons'
import { Gradient } from 'react-gradient'

const { Paragraph, Title } = Typography;

const antIcon = <LoadingOutlined style={{ fontSize: 40, color: '#5dbe8c' }} spin />

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true)
  const [rent, setRent] = useState(null)

  const useQuery = () => new URLSearchParams(useLocation().search)
  const preference_id = useQuery().get('preference_id')
  
  const updateGivenRent = async (preferenceId) => {
    try {
      const { data } = await updateRent({preferenceId, status: 'in-progress'})
      setRent(data)
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

  useEffect(() => {
    updateGivenRent(preference_id)
  }, [])

  return (
    <Row justify="center" align="middle" className="main-row auth-cont success-page">
      <Col xs={22} sm={18} md={14} lg={10} xl={8} xxl={6}>
        <div>
          {loading || !rent ? (
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Spin indicator={antIcon} />
            </div>
          ) : (
            <>
              <Gradient
                gradients={[
                  ['#00a1ba', '#9cd873'],
                ]}
                property="background"
                element="span"
                angle="45deg"
                className="text ant-typography check-cont"
              >
                <CheckOutlined />
              </Gradient>
              <Title level={2}>Thank you for your rent!</Title>
              <Paragraph>
                Your rent for {rent.product.name} has successfully started!
              </Paragraph>
              <Paragraph>
                You can view more info in your profile page
              </Paragraph>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <Button type="primary" size={'large'} shape="round" style={{height: 'auto', padding: '6px 30px'}}>
                  <Link to='/profile/rents' style={{color: '#fff', fontSize: '1.5em'}}>More info</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </Col>
    </Row>
  )
}

export default PaymentSuccess
