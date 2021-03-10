import { useState, useEffect, useRef } from 'react'
import { useAuthInfo } from '../hooks/authContext'
import { getAllProducts } from '../services/products'
import { getProductsByQuery } from '../services/products'
import ProductCard from '../components/ProductCard'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { Collapse, Row, Col, Pagination, Skeleton, Empty, Slider } from 'antd'

const { Panel } = Collapse

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY

const Products = () => {
  const {user} = useAuthInfo()
  const [receivedProducts, setReceivedProducts] = useState(null)
  const mapContainer = useRef()
  const [map, setMap] = useState(null)
  const [lng, setLng] = useState(user && user.location.coordinates ? user.location.coordinates[0] : -70.9)
  const [lat, setLat] = useState(user && user.location.coordinates ? user.location.coordinates[1] : 42.35)
  const [radius, setRadius] = useState(1)
  const [collapseOpen, setCollapseOpen] = useState(true)
  const [collapseText, setCollapseText] = useState(<h3>Colse map</h3>)
  const [loading, setLoading] = useState(false)

  async function getProducts(longitude, latitude, givenRadius) {
    setLoading(true)
    const query = {
      limit: 30,
      category: null,
      center: [longitude, latitude],
      radius: givenRadius
    }
    const {data:products} = await getProductsByQuery(query)
    setReceivedProducts(products.products)
    setLoading(false)
  }

  useEffect(() => {
    getProducts(lng, lat, radius)
  }, [])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 12
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
      marker.setLngLat(map.getCenter())
      map.getSource('polygon').setData(createGeoJSONCircle([map.getCenter().lng, map.getCenter().lat], radius, false))
      getProducts(map.getCenter().lng, map.getCenter().lat, radius)
      updateLocation(map.getCenter().lng, map.getCenter().lat)
      setMap(map)
    })

    map.on("load", () => {
      setMap(map)
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
  }, [])
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

  const updateLocation = (longitude, latitude) => {
    setLng(longitude)
    setLat(latitude)
  }

  const kmSliderRadius = value => {
    setRadius(value)
    map.getSource('polygon').setData(createGeoJSONCircle([map.getCenter().lng, map.getCenter().lat], value, false))
  }

  const kmSliderSearch = value => {
    setRadius(value)
    getProducts(lng, lat, value)
  }

  return (
    <Row>
      <Col span={24}>
        <Collapse defaultActiveKey={['1']} bordered={false} ghost onChange={changeCollapseState}>
          <Panel header={collapseText} key="1">
            <div className="map-container" ref={mapContainer} style={{height: '400px'}} />
          </Panel>
        </Collapse>
      </Col>
      <Col span={24}>
        <Row wrap={false}>
          <Col flex="220px">
            <Slider
              min={0.5}
              max={20}
              onChange={kmSliderRadius}
              onAfterChange={kmSliderSearch}
              value={radius}
              step={0.5}
            />
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
