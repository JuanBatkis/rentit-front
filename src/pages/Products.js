import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuthInfo } from '../hooks/authContext'
import { getProductsByQuery } from '../services/products'
import ProductCard from '../components/ProductCard'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { Collapse, Row, Col, Skeleton, Empty, Slider, Typography, Button, notification } from 'antd'
import CustomSlider from '../components/CustomSlider' 
import { useMapContext } from '../contexts/mapContext'

const { Panel } = Collapse
const { Title } = Typography

//mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY
mapboxgl.accessToken = 'pk.eyJ1IjoianVhbmJhdGtpcyIsImEiOiJja2xlMDJ1Y240ZHR1Mnd1aTVqOGIxdWpyIn0.GQOtc1ghwfAhcaavE_Z3yA'
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const Products = () => {
  const {user} = useAuthInfo()
  const { category } = useParams()
  const [receivedProducts, setReceivedProducts] = useState(null)
  const mapContainer = useRef()
  const { mapData, updateValue } = useMapContext()
  const { lat, lng, radius } = mapData
  const [map, setMap] = useState(null)
/*   const [lng, setLng] = useState(user && user.location.coordinates ? user.location.coordinates[0] : -58.401947) */
/*   const [lat, setLat] = useState(user && user.location.coordinates ? user.location.coordinates[1] : -34.595134) */
  /* const [radius, setRadius] = useState(1) */
  const [collapseOpen, setCollapseOpen] = useState(true)
  const [collapseText, setCollapseText] = useState(<h3>Colse map</h3>)
  const [loading, setLoading] = useState(false)

  async function getProducts(longitude, latitude, givenRadius) {
    try {
      setLoading(true)
      const query = {
        limit: 30,
        category: category,
        center: [longitude, latitude],
        radius: givenRadius
      }
      const {data:products} = await getProductsByQuery(query)
      setReceivedProducts(products.products)
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
    updateValue({
      lat: user && user.location.coordinates ? user.location.coordinates[1] : -34.595134,
      lng: user && user.location.coordinates ? user.location.coordinates[0] : -58.401947
    })
    setMap(new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 12
    }))
  }, [])

  useEffect(() => {
    getProducts(lng, lat, radius)
  }, [category])


  useEffect(() => {
    if (!map) return;
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

    // Add geolocate control to the map.
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        showAccuracyCircle: false,
        showUserLocation: false
      })
    )

    const marker = new mapboxgl.Marker({
      draggable: false
    })
      .setLngLat([lng, lat])
      .addTo(map)

    map.on('movestart', function(e) {
      marker.setLngLat(map.getCenter())
      map.getSource('polygon').setData(createGeoJSONCircle([map.getCenter().lng, map.getCenter().lat], radius, false))
    })

    map.on('move', function(e) {
      marker.setLngLat(map.getCenter())
      map.getSource('polygon').setData(createGeoJSONCircle([map.getCenter().lng, map.getCenter().lat], radius, false))
    })

    map.on('moveend', function(e) {
      console.log({radius})
      marker.setLngLat(map.getCenter())
      map.getSource('polygon').setData(createGeoJSONCircle([map.getCenter().lng, map.getCenter().lat], radius, false))
   /*    getProducts(map.getCenter().lng, map.getCenter().lat, radius) */
      updateLocation(map.getCenter().lng, map.getCenter().lat)
     /*  setMap(map) */
    })

    map.on("load", () => {
     /*  setMap(map) */
    })

    map.on('load', function () {
      map.addSource("polygon", createGeoJSONCircle([map.getCenter().lng, map.getCenter().lat], radius, true));

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
  }, [map])
  //[lng, lat, radius]

  const createGeoJSONCircle = (center, radiusInKm, isFirstDraw, points) => {
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

    if (isFirstDraw) {
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
    } else {
      return {
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

  const changeCollapseState = () => {
    if (collapseOpen) {
      setCollapseText(<h3>Open map</h3>)
      setCollapseOpen(false)
    } else {
      setCollapseText(<h3>Close map</h3>)
      setCollapseOpen(true)
    }
  }

  const updateLocation = (lng, lat) => {
   /*  updateValue({
      lat, lng
    }) */
  /*   setLng(longitude)
    setLat(latitude) */
  }

  const kmSliderRadius = value => {
  /*   setRadius(value) */
    updateValue({ radius: value })
    map.getSource('polygon').setData(createGeoJSONCircle([map.getCenter().lng, map.getCenter().lat], radius, false))
  }

  const kmSliderSearch = value => {
   /*  setRadius(value) */
    updateValue({ radius: value })
    getProducts(lng, lat, radius)
  }

  return (
    <Row className='store-container'>
      <Col span={24}>
        <Collapse defaultActiveKey={['1']} bordered={false} ghost onChange={changeCollapseState}>
          <Panel header={collapseText} key="1">
            <div className="map-container" ref={mapContainer} style={{height: '400px'}} />
          </Panel>
        </Collapse>
      </Col>
      <Col span={24}>
        <Row wrap={false}>
          <Col flex="220px" className='filters-col'>
            <Title level={3}>Radius</Title>
            <Slider
              min={0.5}
              max={20}
              onChange={kmSliderRadius}
              onAfterChange={kmSliderSearch}
              value={radius}
              step={0.5}
              tipFormatter={(value) => `${value}km`}
            />
            <Title level={3}>Categories</Title>
            <Button type='text'><Link to='/products/all'>All</Link></Button>
            <Button type='text'><Link to='/products/tools'>Tools</Link></Button>
            <Button type='text'><Link to='/products/technology'>Technology</Link></Button>
            <Button type='text'><Link to='/products/vehicles'>Vehicles</Link></Button>
            <Button type='text'><Link to='/products/sports'>Sports</Link></Button>
            <Button type='text'><Link to='/products/other'>Other</Link></Button>
          </Col>
          <Col flex="auto">
            <Row gutter={[16, 16]} style={{padding: '20px'}} id='latest-prods'>
              {!receivedProducts || loading ? (
                <Skeleton active />
              ) : (receivedProducts.length === 0 ? (
                <Empty description={<p>Sorry, it seems like there are no products here</p>} />
              ) : receivedProducts.map(product => (
                <ProductCard product={product} />
              )))}
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Products
