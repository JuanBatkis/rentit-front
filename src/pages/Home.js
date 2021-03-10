import React, { useRef, useEffect, useState } from 'react'
import { getAllProducts } from '../services/products'
import ProductCard from '../components/ProductCard'
import { Typography, Col, Row, Carousel, Button, Skeleton } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

const { Title } = Typography

const Home = () => {
  const [products, setProducts] = useState(null)
  const iframeRef = useRef()
  const divRef = useRef()
  const slider = useRef()

  const showIframe = () => {
    iframeRef.current.style.opacity = '1'
    divRef.current.style.opacity = '0'
  }

  /* const buildSlider = (givenProducts) => {
    let count = 0
    let builtJSX
    for (let index = 0; index < givenProducts.length; index = index + 5) {
      builtJSX += (<div></div>)
    }
  } */

  useEffect(() => {
    async function getProducts() {
      const {data:products} = await getAllProducts(4)
      setProducts(products.products)
    }
    getProducts()
  }, [])
  
  const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  }

  return (
    <>
      <section id='main-banner'>
        <Row className='full-heigh' justify="center" align="middle">
          <Col span={7} offset={2}>
            <Title>
              A new way to get what you need
            </Title>
          </Col>
          <Col span={15} className='full-heigh iframe-container'>
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
            />
          </Col>
        </Row>
      </section>
      <Row gutter={16} style={{padding: '20px'}} id='latest-prods'>
        {products ? products.map(product => (
          <ProductCard product={product} />
        )) : <Skeleton active />}
      </Row>
      {/* <Row align="middle">
        <Col span={1} align="right">
          <Button type="text" onClick={() => slider.current.prev()} size={'large'}>
            <LeftOutlined />
          </Button>
        </Col>
        <Col span={22}>
          <Carousel ref={slider} dots={false}>
            {products ? products.map(product => (

            )) : <Skeleton active />}
            <div>
              <h3 style={contentStyle}>1</h3>
            </div>
            <div>
              <h3 style={contentStyle}>2</h3>
            </div>
            <div>
              <h3 style={contentStyle}>3</h3>
            </div>
            <div>
              <h3 style={contentStyle}>4</h3>
            </div>
          </Carousel>
        </Col>
        <Col span={1}>
          <Button type="text" onClick={() => slider.current.next()} size={'large'}>
            <RightOutlined />
          </Button>
        </Col>
      </Row> */}
    </>
  )
}

export default Home