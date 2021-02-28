import React, { useRef, useState, useEffect } from 'react'
import {Typography, Col, Row, Button} from 'antd'
import '../styles/home.scss'

const { Title } = Typography

function Home() {
  const iframeRef = useRef()
  const divRef = useRef()

  const showIframe = () => {
    /* console.log(iframeRef.current.childNodes)
    console.log(document.querySelector('.spline-watermark')) */
    iframeRef.current.style.opacity = '1'
    divRef.current.style.opacity = '0'
  };

  return (
    <section id='main-banner'>
      <Row className='full-heigh' justify="center" align="middle">
        <Col span={7} offset={2}>
          <Title>
            A new way to get what you need
          </Title>
        </Col>
        <Col span={15} className='full-heigh'>
          <div
            ref={divRef}
            style={{
              backgroundImage: 'url(https://res.cloudinary.com/djv6xyyqp/image/upload/v1614452805/rentit/images/floating_oszbj8.png)',
              backgroundPosition: 'center',
              position: 'absolute',
              height: '100%',
              width: '100%',
              opacity: '1',
              transition: 'opacity 2s'
            }}
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
  )
}

export default Home