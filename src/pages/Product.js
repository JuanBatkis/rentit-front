import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductById } from '../services/products'
import { getRentPreference, createRent } from '../services/rents'
import { createQuestion } from '../services/questions'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Typography, Col, Row, Carousel, Button, Skeleton, Tag, Divider, DatePicker, Descriptions, Form, Input, notification, Comment, Tooltip } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import moment from 'moment'
import { Gradient } from 'react-gradient'
import DetailedRating from '../components/DetailedRating'

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker

//mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY
mapboxgl.accessToken = 'pk.eyJ1IjoianVhbmJhdGtpcyIsImEiOiJja2xlMDJ1Y240ZHR1Mnd1aTVqOGIxdWpyIn0.GQOtc1ghwfAhcaavE_Z3yA'
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const Product = () => {
  const { id } = useParams()
  const buyButtonRef = useRef()
  const [product, setProduct] = useState(null)
  const [questions, setQuestions] = useState([])
  const [form] = Form.useForm()
  const [questionLoading, setQuestionLoading] = useState(false)
  const [hoursDisabled, setHoursDisabled] = useState(false)
  const [daysDisabled, setDaysDisabled] = useState(false)
  const [time, setTime] = useState(null)
  const [rentedFrom, setRentedFrom] = useState(null)
  const [rentedTo, setRentedTo] = useState(null)
  const [total, setTotal] = useState(0)
  const [rentVisible, setRentVisible] = useState(false)
  const [preferenceId, setPreferenceId] = useState(null)

  const mapContainer = useRef()
  const [lng, setLng] = useState(0)
  const [lat, setLat] = useState(0)

  useEffect(() => {
    async function getProducts() {
      try {
        const cleanId = id.split('-')[0]
        const {data:product} = await getProductById(cleanId)
        setProduct(product)
        setQuestions(product.questions.reverse())
        setLng(product.owner.location.coordinates[0])
        setLat(product.owner.location.coordinates[1])
      } catch(error) {
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

  useEffect(() => {
    if (lng && lat) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: 12
      })
  
      // Add zoom and rotation controls to the map.
      map.addControl(new mapboxgl.NavigationControl())

      map.on('load', function () {
        map.addSource("polygon", createGeoJSONCircle([lng, lat], 0.8));
  
        map.addLayer({
            "id": "polygon",
            "type": "fill",
            "source": "polygon",
            "layout": {},
            "paint": {
                "fill-color": "#5dbe8c",
                "fill-opacity": 0.5
            }
        })
      })
  
      return () => map.remove()
    }
  }, [lng, lat])

  const createGeoJSONCircle = (center, radiusInKm, points) => {
    if(!points) points = 64;

    const coords = {
      latitude: center[1],
      longitude: center[0]
    }

    const km = radiusInKm

    let ret = []
    const distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180))
    const distanceY = km/110.574

    let theta, x, y
    for(let i=0; i<points; i++) {
      theta = (i/points)*(2*Math.PI)
      x = distanceX*Math.cos(theta)
      y = distanceY*Math.sin(theta)

      ret.push([coords.longitude+x, coords.latitude+y])
    }
    ret.push(ret[0])

    return {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [ret]
          }
        }]
      }
    }
  }

  const onChange = (value, dateString, input) => {
    if (input === 'hours') {
      setHoursDisabled(false)
      setDaysDisabled(true)
    } else {
      setHoursDisabled(true)
      setDaysDisabled(false)
    }

    if (!value) {
      setHoursDisabled(false)
      setDaysDisabled(false)
      setTime(null)
      setRentVisible(false)
      return
    }

    if (input === 'hours') {
      const currentTime = value[1].diff(value[0], 'hours') + 1
      setTime(currentTime)
      setRentedFrom(value[0])
      setRentedTo(value[1])
      setRentVisible(true)
      setTotal(currentTime * product.priceHour)
      createPreference(product._id, product.name, currentTime * product.priceHour, currentTime > 1 ? `for ${currentTime} hours` : `for ${currentTime} hour`)
    } else {
      const currentTime = value[1].diff(value[0], 'days') + 1
      setTime(currentTime)
      setRentedFrom(value[0])
      setRentedTo(value[1])
      setRentVisible(true)
      setTotal(currentTime * product.priceDay)
      createPreference(product._id, product.name, currentTime * product.priceDay, currentTime > 1 ? `for ${currentTime} days` : `for ${currentTime} day`)
    }
  }

  const createPreference = async (productId, productName, total, time) => {
    try {
      const rentPreferenceInfo = { productId, productName, total, time }
      const {data} = await getRentPreference(rentPreferenceInfo)
  
      const script = document.createElement("script")
      script.src = "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js"
      script.setAttribute("data-preference-id", data.preferenceId)
      script.setAttribute("data-button-label", "Rent")
  
      setPreferenceId(data.preferenceId)
  
      if (buyButtonRef.current) {
        buyButtonRef.current.innerHTML = ''
        buyButtonRef.current.appendChild(script)
      }
    } catch (error) {
      notification['error']({
        message: 'Something went wrong',
        description: 'You must be logged in to continue with this rent',
        duration: 5,
        style: {
          borderRadius: '20px'
        }
      })
    }
  }

  const clickedCreateRent = async () => {
    try {
      let type
      if (!hoursDisabled) {
        type = 'hour'
      } else {
        type = 'day'
      }
  
      const rentInfo = {
        product: product._id,
        owner: product.owner._id,
        total,
        rentedFrom: rentedFrom.toDate(),
        rentedTo: rentedTo.toDate(),
        type,
        preferenceId
      }
  
      await createRent(rentInfo)
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

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current < moment().startOf('day');
  }

  const handleQuestionSubmit = async (question) => {
    setQuestionLoading(true)
    const data = {
      product: product._id,
      owner: product.owner,
      description: question.question
    }
    try {
      await createQuestion(data)
      setQuestions([data, ...questions])
      setQuestionLoading(false)
    } catch (error) {
      notification['error']({
        message: 'Something went wrong',
        description: error.response.data.message,
        duration: 5,
        style: {
          borderRadius: '20px'
        }
      })
      setQuestionLoading(false)
    }
  }

  return (
    <div className='product-cont'>
      <Row gutter={[18, 18]} justify="center" className='product-row'>
        <Col span={14}>
          {product ? (
            <Carousel>
              {product.images.map(image =>(
                <img alt="product" src={image} className='slider-image' />
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
                <Tag><Link to='/products/all'>products</Link></Tag>
                <RightOutlined />
                <Tag><Link to={`/products/${product.category}`}>{product.category}</Link></Tag>
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
                  onChange={(value, dateString) => onChange(value, dateString, 'hours')}
                  disabledDate={disabledDate}
                  disabled={hoursDisabled}
                />
                {product.priceDay && (
                  <>
                    <Title level={4} style={{marginTop: 0}}>or</Title>
                    <Title level={2} style={{display: 'inline-block', marginTop: 0}}>${product.priceDay}</Title><Text>/day</Text>
                    <br/>
                    <RangePicker
                      format="YYYY/MM/DD"
                      onChange={(value, dateString) => onChange(value, dateString, 'days')}
                      disabledDate={disabledDate}
                      disabled={daysDisabled}
                    />
                  </>
                )}
                {rentVisible ? (
                  <>
                    <div className='total-container'>
                      <Title level={2}>Total: ${total} </Title>
                      {!hoursDisabled ? (
                        <Text>{time > 1 ? `(${time} hours)` : `(${time} hour)`}</Text>
                      ) : (
                        <Text>{time > 1 ? `(${time} days)` : `(${time} day)`}</Text>
                      )}
                    </div>
                    <div ref={buyButtonRef} className='mp-bttn-container' onClick={clickedCreateRent}></div>
                  </>
                ) : (
                  <Tooltip placement="topLeft" title={<span>Please select your time period for the rental</span>}>
                    <Gradient
                      gradients={[
                        ['#00a1ba', '#9cd873'],
                      ]}
                      property="background"
                      element="button"
                      angle="45deg"
                      className="add-rent add-rent-disabled ant-btn ant-btn-primary ant-btn-round ant-btn-lg"
                    >
                      Rent
                    </Gradient>
                  </Tooltip>
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
        {product && (
          <Col span={20}>
            <Divider />
            <Gradient
                gradients={[
                  ['#00a1ba', '#9cd873'],
                ]}
                property="text"
                element="h2"
                angle="45deg"
                className="ant-typography"
              >
                About
            </Gradient>
            <Title level={4}>Description</Title>
            <Paragraph>{product.description}</Paragraph>
            <Title level={4}>Owner</Title>
            <Descriptions bordered>
              {product.owner.storeName ? (
                <Descriptions.Item label="Store name" span={3}>{product.owner.storeName}</Descriptions.Item>
              ) : (
                <Descriptions.Item label="Name" span={3}>{product.owner.firstName}</Descriptions.Item>
              )}
              <Descriptions.Item label="Owner rating" span={3}>
                <DetailedRating rating={product.owner.rating} />
              </Descriptions.Item>
              <Descriptions.Item label="Location" span={3}>
                <div className="map-container" ref={mapContainer} style={{height: '300px'}} />
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Gradient
                gradients={[
                  ['#00a1ba', '#9cd873'],
                ]}
                property="text"
                element="h2"
                angle="45deg"
                className="ant-typography"
              >
                Questions
            </Gradient>
            <Form form={form} onFinish={handleQuestionSubmit} layout='vertical' className='question-form'>
              <Title level={4}>Ask something</Title>
              <Form.Item
                name="question"
              >
                <Input.TextArea
                  maxLength={1000}
                  showCount={true}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                />
              </Form.Item>
              <Button type='primary' htmlType='submit' size='large' shape="round" loading={questionLoading}>
                Ask
              </Button>
            </Form>
            <Title level={4}>Previously asked</Title>
            {questions.length > 0 ? questions.map( singleQuestion => (
              <Comment
                content={<p style={{fontSize: '1.2em'}}>{singleQuestion.description}</p>}
              >
                {singleQuestion.answer && (
                  <Comment
                    content={<p>{singleQuestion.answer}</p>}
                  />
                )}
              </Comment>
            )) : (
              <Paragraph>No questions yet. Be the first one to ask!</Paragraph>
            )}
          </Col>
        )}
      </Row>
    </div>
  )
}

export default Product
