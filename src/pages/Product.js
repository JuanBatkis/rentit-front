import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductById } from '../services/products'
import { Typography, Col, Row, Carousel, Button, Skeleton, Tag, Divider, DatePicker } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import moment from 'moment'
import { Gradient } from 'react-gradient'
import DetailedRating from '../components/DetailedRating'

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker

const Product = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    async function getProducts() {
      const cleanId = id.split('-')[0]
      console.log(cleanId);
      const {data:product} = await getProductById(cleanId)
      console.log(product);
      setProduct(product)
    }
    getProducts()
  }, [])

  function onChange(value, dateString) {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  }
  
  function onOk(value) {
    console.log('onOk: ', value);
  }

  function disabledDate(current) {
    // Can not select days before today and today
    console.log(current)
    console.log(moment().endOf('day'))
    return current < moment().startOf('day');
  }

  return (
    <div className='product-cont'>
      <Row gutter={[16, 16]}>
        <Col span={14}>
          {product ? (
            <Carousel>
              {product.images.map(image =>(
                <img alt="product image" src={image} className='slider-image' />
              ))}
            </Carousel>
          ) : (
            <Skeleton.Image className='image-skeleton' />
          )}
        </Col>
        <Col span={10}>
          {product ? (
            <>
              <div className='product-breadcrumbs'>
                <Tag><Link to='/products'>products</Link></Tag>
                <RightOutlined />
                <Tag>{product.category}</Tag>
              </div>
              <Gradient
                  gradients={[
                    ['#00a1ba', '#9cd873'],
                  ]}
                  property="text"
                  element="h1"
                  angle="45deg"
                  className="text ant-typography"
                >
                  {product.name}
              </Gradient>
              <DetailedRating rating={product.rating} />
              <Divider dashed />
              <section id='price-cont'>
                <Title level={2} style={{display: 'inline-block'}}>${product.priceHour}</Title><Text>/hr</Text>
                <br/>
                <RangePicker
                  showTime={{ format: 'HH' }}
                  format="YYYY/MM/DD HH:00"
                  onChange={onChange}
                  onOk={onOk}
                  disabledDate={disabledDate}
                />
                {product.priceDay && (
                  <>
                    <Title level={4} style={{marginTop: 0}}>or</Title>
                    <Title level={2} style={{display: 'inline-block', marginTop: 0}}>${product.priceDay}</Title><Text>/day</Text>
                    <br/>
                    <RangePicker
                      format="YYYY/MM/DD"
                      onChange={onChange}
                      onOk={onOk}
                      disabledDate={disabledDate}
                    />
                  </>
                )}
              </section>
            </>
          ) : (
            <>
              <Skeleton.Button active size='small' shape='round' />
              <Skeleton.Button active size='small' shape='round' />
              <br/>
              <Skeleton.Input style={{ width: 300, marginTop: '10px', marginBottom: '40px' }} active size='large' />
              <Skeleton active />
            </>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default Product
