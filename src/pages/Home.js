import React, { useRef } from 'react'
import {Typography, Col, Row} from 'antd'

const { Title } = Typography

const Home = () => {
  const iframeRef = useRef()
  const divRef = useRef()

  const showIframe = () => {
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
  )
}

export default Home