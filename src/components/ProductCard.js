import { Col, Skeleton, Card } from 'antd'

const { Meta } = Card

const ProductCard = ({product}) => {
  return (
    <Col span={6}>
      <Card
        hoverable
        cover={product.images[0] ? <img alt="product image" src={product.images[0]} style={{height:'320px', objectFit: 'contain', padding: '1px'}} /> : <Skeleton.Image style={{height:'320px', width:'100%'}}/>}
      >
        <Meta title={product.name} description={product.priceDay ? `$${product.priceHour}/hr or $${product.priceDay}/day` : `$${product.priceHour}/hr`} />
      </Card>
    </Col>
  )
}

export default ProductCard
