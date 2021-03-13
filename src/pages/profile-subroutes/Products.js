import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthInfo } from '../../hooks/authContext'
import { getUserProducts } from '../../services/products'
import { deleteProduct } from '../../services/products'
import { Table, Space, Skeleton, Button, Tag, Popconfirm, notification } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { Gradient } from 'react-gradient'

const Info = () => {
  const {user} = useAuthInfo()
  const [products, setProducts] = useState(null)

  async function getProducts() {
    try {
      const {data:products} = await getUserProducts(user._id, 20)
      setProducts(products.products)
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

  async function deleteProductAndReload(id) {
    try {
      await deleteProduct(id)
      const {data:products} = await getUserProducts(user._id, 20)
      setProducts(products.products)
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
    getProducts()
  }, [])

  const renderName = (value, row, index) => {
    const slug = `${row._id}-${value.replace(/\s+/g, '-').toLowerCase()}`
    return <Link to={`/product/${slug}`}>{value}</Link>
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: renderName,
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
        return(
          <Space size="middle">
            {/* <Button type="link" size={'large'}>
              <EditOutlined />
            </Button> */}
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
          {user.location.coordinates ? (
            <Button type="primary" icon={<PlusOutlined />} size={'large'} shape="round">
              <Link to='/profile/products/add' style={{color: '#fff'}}>Add new</Link>
            </Button>
          ) : (
            <Button type="primary" disabled size={'large'} shape="round">
              Save your location to add products
            </Button>
          )}
        </Space>
      </div>
      {products ? <Table dataSource={products} columns={columns} scroll={{ x: true }} /> : <Skeleton active />}
    </>
  )
}

export default Info
