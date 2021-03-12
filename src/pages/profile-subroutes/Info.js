import { useState, useEffect, useRef } from 'react'
import { useAuthInfo } from '../../hooks/authContext'
import { LocationFn, getCurrentUser } from "../../services/auth"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { Typography, Divider, Row, Col, Button, Space, Alert } from 'antd'
import { CheckOutlined } from '@ant-design/icons';
import { Gradient } from 'react-gradient'
import DetailedRating from '../../components/DetailedRating'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY

const { Title, Text } = Typography

const Info = () => {
  const {user} = useAuthInfo()
  const { setUser } = useAuthInfo()
  const [editableFirstName, setEditableFirstName] = useState(user.firstName)
  const [editableLasttName, setEditableLastName] = useState(user.lastName)
  const [editablestoreName, setEditablestoreName] = useState(user.storeName)
  const [editablePhone, setEditablePhone] = useState(user.phone)

  const mapContainer = useRef()
  const [mapSaving, setMapSaving] = useState(false)
  const [mapSavingIcon, setMapSavingIcon] = useState(false)
  const [mapSavingText, setMapSavingText] = useState('Save location')
  const [map, setMap] = useState(null)
  const [lng, setLng] = useState(user.location.coordinates ? user.location.coordinates[0] : -73.51822)
  const [lat, setLat] = useState(user.location.coordinates ? user.location.coordinates[1] : 40.76127)
  const [mapMoved, setMapMoved] = useState(false)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: user.location.coordinates ? 12 : 4
    })

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      flyTo: {
        speed: 2
      }
    })

    map.addControl(geocoder)

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl())

    const marker = new mapboxgl.Marker({
      draggable: false
    })
        .setLngLat([lng, lat])
        .addTo(map)

    map.on('movestart', function(e) {
      marker.setLngLat(map.getCenter())
    })
    
    map.on('move', function(e) {
      marker.setLngLat(map.getCenter())
    })
    
    map.on('moveend', function(e) {
      if (map.getCenter().lng.toFixed(4) !== lng.toFixed(4) || map.getCenter().lat.toFixed(4) !== lat.toFixed(4)) {
        setMapMoved(true)
      }
      setMapSavingIcon(false)
      setMapSavingText('Save location')
      marker.setLngLat(map.getCenter())
    })

    map.on("load", () => {
      setMap(map)
    })

    return () => map.remove()
  }, [lng, lat])
  
  const returnToOriginalLocation = () => {
    map.flyTo({
      center: [lng, lat],
      speed: 2,
      essential: true // this animation is considered essential with respect to prefers-reduced-motion
    })

    setMapMoved(false)
  }

  const getSession = async () => {
    const { data } = await getCurrentUser()
    if (data) {
      setUser(data)
    }
  }

  const saveLocation = async () => {
    mapContainer.current.style.pointerEvents = 'none'
    mapContainer.current.style.opacity = 0.5
    setMapSaving(true)
    setMapSavingText('Saving location')
    await LocationFn({lng: map.getCenter().lng, lat: map.getCenter().lat})
    getSession()
    mapContainer.current.style.pointerEvents = 'all'
    mapContainer.current.style.opacity = 1
    setLng(map.getCenter().lng)
    setLat(map.getCenter().lat)
    setMapSaving(false)
    setMapSavingIcon(<CheckOutlined />)
    setMapSavingText('Saved location')
  }

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
        <Col span={12} className="location-container">
          {!user.location.coordinates && <Alert message="You won't me able to create products without saving a location" type="warning" showIcon />}
          <div className="map-container" ref={mapContainer} style={{height: '500px'}} />
          <Space className="location-buttons" style={mapMoved ? {opacity: 1, pointerEvents: 'all'} : {opacity: 0, pointerEvents: 'none'}}>
            <Button type="primary" shape="round" size={'large'} loading={mapSaving} icon={mapSavingIcon} onClick={saveLocation}>
              {mapSavingText}
            </Button>
            <Button danger shape="round" size={'large'} onClick={returnToOriginalLocation}>
              Restore location
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  )
}

export default Info
