import React, { useRef } from 'react'
import {Typography, Col, Row, Button} from 'antd'
import '../styles/home.scss'

const { Title } = Typography

function Home() {
  const iframeRef = useRef()

  const showIframe = () => {
    /* console.log(iframeRef.current.childNodes)
    console.log(document.querySelector('.spline-watermark')) */
    iframeRef.current.style.opacity = '1'
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
          <iframe src='https://my.spline.design/untitled-a2f34d849ac091cf2eb127bc869777a2/' frameborder='0' width='100%' height='100%' onLoad={showIframe} ref={iframeRef}></iframe>
        </Col>
      </Row>
    </section>
  )
}

export default Home