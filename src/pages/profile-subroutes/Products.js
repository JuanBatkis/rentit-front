import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthInfo } from '../../hooks/authContext'
import { getUserProducts } from '../../services/products'
import { deleteProduct } from '../../services/products'
import { Typography, Divider, Table, Space, Skeleton, Button, Tag, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Gradient } from 'react-gradient'
import DetailedRating from '../../components/DetailedRating'

const { Title, Text } = Typography

const Info = () => {
  const {user} = useAuthInfo()
  const [products, setProducts] = useState(null)

  async function getProducts() {
    const {data:products} = await getUserProducts(user._id, 20)
    setProducts(products.products)
  }

  async function deleteProductAndReload(id) {
    await deleteProduct(id)
    const {data:products} = await getUserProducts(user._id, 20)
    setProducts(products.products)
  }

  useEffect(() => {
    getProducts()
  }, [])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Price hour',
      dataIndex: 'priceHour',
      key: 'priceHour',
      render: price => `$${price}`,
    },
    {
      title: 'Price day',
      dataIndex: 'priceDay',
      key: 'priceDay',
      render: price => price ? `$${price}` : '-',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: category => <Tag color="green">{category}</Tag>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: rating => rating.total === 0 ? '-' : rating.total,
    },
    {
      title: 'Action',
      key: '_id',
      align: 'center',
      render: prod => {
        console.log(prod._id);
        return(
          <Space size="middle">
            <Button type="link" size={'large'}>
              <EditOutlined />
            </Button>
            <Popconfirm
              title="Are you sure to delete this product?"
              placement="topRight"
              onConfirm={() => deleteProductAndReload(prod._id)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button type="link" danger size={'large'}>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Space>
        )
      },
    },
  ];

  return (
    <>
      <div className='user-info-header'>
        <Space size="middle">
          <Gradient
            gradients={[
              ['#00a1ba', '#9cd873'],
            ]}
            property="text"
            element="h1"
            angle="45deg"
            className="text ant-typography"
          >
            Products
          </Gradient>
          <Button type="primary" icon={<PlusOutlined />} size={'large'} shape="round">
            <Link to='/profile/products/add' style={{color: '#fff'}}>Add new</Link>
          </Button>
        </Space>
      </div>
      <Divider />
      {products ? <Table dataSource={products} columns={columns} /> : <Skeleton active />}
    </>
  )
}

export default Info
