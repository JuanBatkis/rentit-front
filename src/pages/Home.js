import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllProducts } from '../services/products'
import ProductCard from '../components/ProductCard'
import { Typography, Col, Row, Skeleton, notification } from 'antd'
import { Gradient } from 'react-gradient'

const { Title, Paragraph } = Typography

const Home = () => {
  const [products, setProducts] = useState(null)
  const iframeRef = useRef()
  const divRef = useRef()

  const showIframe = () => {
    iframeRef.current.style.opacity = '1'
    divRef.current.style.opacity = '0'
  }

  useEffect(() => {
    async function getProducts() {
      try {
        const {data:products} = await getAllProducts(8)
        setProducts(products.products)
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
    getProducts()
  }, [])

  return (
    <>
      <section id='main-banner'>
        <Row className='full-heigh' justify="center" align="middle">
          <Col xs={24} md={7} offset={2} className='banner-title'>
            <Title>
              A new way to get what you need
            </Title>
          </Col>
          <Col xs={24} md={15} className='full-heigh iframe-container'>
            <div
              id='iframeCover'
              ref={divRef}
              style={{ opacity: '1' }}
            ></div>
            <iframe src='https://my.spline.design/floating-adbb8c927f6e8e69a180701a9fb2ad6c/'
              frameBorder='0'
              width='100%'
              height='100%'
              onLoad={showIframe}
              ref={iframeRef}
              title='3D Objects'
            />
          </Col>
        </Row>
      </section>
      <section id='latest-products'>
        <Gradient
          gradients={[
            ['#00a1ba', '#9cd873'],
          ]}
          property="text"
          element="h2"
          angle="45deg"
          className="text ant-typography"
        >
          Latest products
        </Gradient>
        <Row gutter={[16, 16]} style={{padding: '20px'}}>
          {products ? products.map(product => (
            <ProductCard product={product} />
          )) : <Skeleton active />}
        </Row>
      </section>
      <section id='steps-cont'>
        <Gradient
          gradients={[
            ['#00a1ba', '#9cd873'],
          ]}
          property="text"
          element="h2"
          angle="45deg"
          className="text ant-typography"
        >
          Just a few simple steps
        </Gradient>
        <Row gutter={[16, 16]} style={{padding: '20px'}} justify="center">
          <Col span={8} align="middle">
            <Gradient
              gradients={[
                ['#00a1ba', '#9cd873'],
              ]}
              property="background"
              element="h2"
              angle="45deg"
              className="text ant-typography steps"
            >
              1
            </Gradient>
            <Paragraph>
              Find the best product near you
            </Paragraph>
          </Col>
          <Col span={8} align="middle">
            <Gradient
              gradients={[
                ['#00a1ba', '#9cd873'],
              ]}
              property="background"
              element="h2"
              angle="45deg"
              className="text ant-typography steps"
            >
              2
            </Gradient>
            <Paragraph>
              Select the amount of time you need it
            </Paragraph>
          </Col>
          <Col span={8} align="middle">
            <Gradient
              gradients={[
                ['#00a1ba', '#9cd873'],
              ]}
              property="background"
              element="h2"
              angle="45deg"
              className="text ant-typography steps"
            >
              3
            </Gradient>
            <Paragraph>
              Enjoy your life without unnecessary clutter
            </Paragraph>
          </Col>
          <Col span={8} align="middle">
            <Gradient
              gradients={[
                ['#00a1ba', '#9cd873'],
              ]}
              property="background"
              element="button"
              angle="45deg"
              className="ant-btn ant-btn-primary ant-btn-round ant-btn-lg"
            >
              <Link to='/products/all'>Start renting!</Link>
            </Gradient>
          </Col>
        </Row>
      </section>
    </>
  )
}

export default Home