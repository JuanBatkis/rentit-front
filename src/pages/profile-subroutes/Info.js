import { useState, useEffect, useRef } from 'react'
import { useAuthInfo } from '../../hooks/authContext'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Typography, Divider, Row, Col } from 'antd'
import { Gradient } from 'react-gradient'
import DetailedRating from '../../components/DetailedRating'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY

const { Title, Text } = Typography

const Info = () => {
  const {user} = useAuthInfo()
  const [editableFirstName, setEditableFirstName] = useState(user.firstName)
  const [editableLasttName, setEditableLastName] = useState(user.lastName)
  const [editablestoreName, setEditablestoreName] = useState(user.storeName)
  const [editablePhone, setEditablePhone] = useState(user.phone)

  const mapContainer = useRef()
  const [lng, setLng] = useState(-70.9)
  const [lat, setLat] = useState(42.35)
  const [zoom, setZoom] = useState(9)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
    return () => map.remove();
  }, [lng, lat, zoom])

  return (
    <>
      <div className='user-info-header'>
        <Gradient
          gradients={[
            ['#00a1ba', '#9cd873'],
          ]}
          property="text"
          element="h1"
          angle="45deg"
          className="text ant-typography"
        >
          {`${editableFirstName} ${editableLasttName}`}
        </Gradient>
        <div className='user-score'>
          <Title level={5}>User score:</Title>
          <DetailedRating rating={user.rating} />
        </div>
      </div>
      <Divider />
      <Row gutter={16}>
        <Col span={12}>
          <Title level={2}>User info:</Title>
          <Title level={4}>First name:</Title>
          <Text editable={{ onChange: setEditableFirstName }}>{editableFirstName}</Text>
          <Title level={4}>Last name:</Title>
          <Text editable={{ onChange: setEditableLastName }}>{editableLasttName}</Text>
          <Title level={4}>Store name:</Title>
          <Text editable={{ onChange: setEditablestoreName }}>{editablestoreName}</Text>
          <Title level={4}>Phone number:</Title>
          <Text editable={{ onChange: setEditablePhone }}>{editablePhone}</Text>
        </Col>
        <Col span={12}>
          <div className="map-container" ref={mapContainer} style={{height: '500px'}} />
        </Col>
      </Row>
    </>
  )
}

export default Info
