import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllUserRents } from '../../services/rents'
import { createReview } from '../../services/reviews'
import moment from 'moment'
import { Table, Space, Skeleton, Tabs, Popover, Button, Rate, notification } from 'antd'
import { StarOutlined } from '@ant-design/icons';
import { Gradient } from 'react-gradient'

const { TabPane } = Tabs;

const Rents = () => {
  const [rents, setRents] = useState(null)
  const [tab, setTab] = useState('renter')

  const getRents = async (role) => {
    try {
      setRents(null)
      const {data} = await getAllUserRents(role)
      setRents(data.rents)
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

  const rate = async (value, id, role) => {
    try {
      let review
      if (role === 'product') {
        review = {
          productId: id,
          rating: value,
        }
      } else {
        review = {
          userId: id,
          rating: value,
        }
      }
      await createReview(review)

      notification['success']({
        message: 'Thank you!',
        description: `Your ${value} star review has been added successfully saved 🎉`,
        duration: 5,
        style: {
          borderRadius: '20px'
        }
      })
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
    getRents(tab)
  }, [tab])

  const callback = (key) => {
    if (Number(key) === 1) {
      setTab('renter')
    } else {
      setTab('owner')
    }
  }

  const content = (id, role) => {
    const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful']
    return <Rate tooltips={desc} onChange={(value) => rate(value, id, role)} />
  }

  const renderName = (value, row, index) => {
    const slug = `${row.product._id}-${value.name.replace(/\s+/g, '-').toLowerCase()}`
    
    if (tab === 'owner') {
      return <Link to={`/product/${slug}`}>{value.name}</Link>
    }
    return (
      <Space>
        <Link to={`/product/${slug}`}>{value.name}</Link>
        <Popover placement="topRight" title='Rate product' content={() => content(row.product._id, 'product')} trigger="click">
          <Button type="primary" shape="circle" icon={<StarOutlined />} size="small" />
        </Popover>
      </Space>
    )
  }

  const renderDate = (value, row, index) => {
    if (row.type === 'day') {
      return moment(value).format('YYYY/MM/DD')
    } else {
      return moment(value).format('YYYY/MM/DD HH:00')
    }
  }

  const renderTotal = (value, row, index) => {
    let text = `$${value} for `
    if (row.type === 'day') {
      const time = moment(row.rentedTo).diff(moment(row.rentedFrom), 'days') + 1
      return `${text} ${time} ${time > 1 ? 'days' : 'day'}`
    } else {
      const time = moment(row.rentedTo).diff(moment(row.rentedFrom), 'hours') + 1
      return `${text} ${time} ${time > 1 ? 'hours' : 'hour'}`
    }
  }

  const renderUserName = (value, row, index) => {
    if (tab === 'owner') {
      return (
        <Space>
          {value.firstName}
          <Popover placement="topRight" title='Rate renter' content={() => content(row.renter._id, 'user')} trigger="click">
            <Button type="primary" shape="circle" icon={<StarOutlined />} size="small" />
          </Popover>
        </Space>
      )
    } else {
      if (value.storeName) {
        return (
          <Space>
            {value.storeName}
            <Popover placement="topRight" title='Rate owner' content={() => content(row.owner._id, 'user')} trigger="click">
              <Button type="primary" shape="circle" icon={<StarOutlined />} size="small" />
            </Popover>
          </Space>
        )
      } else {
        return (
          <Space>
            {value.firstName}
            <Popover placement="topRight" title='Rate owner' content={() => content(row.owner._id, 'user')} trigger="click">
              <Button type="primary" shape="circle" icon={<StarOutlined />} size="small" />
            </Popover>
          </Space>
        )
      }
    }
  }

  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: renderName,
    },
    {
      title: 'Rented from',
      dataIndex: 'rentedFrom',
      key: 'rentedFrom',
      render: renderDate,
    },
    {
      title: 'Rented to',
      dataIndex: 'rentedTo',
      key: 'rentedTo',
      render: renderDate,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: renderTotal,
    },
    {
      title: tab === 'owner' ? 'Renter' : 'Owner',
      dataIndex: tab === 'owner' ? 'renter' : 'owner',
      key: tab === 'owner' ? 'renter' : 'owner',
      render: renderUserName,
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
            Rents
          </Gradient>
        </Space>
      </div>
      <Tabs onChange={callback} type="card">
        <TabPane tab="Rented by me" key="1">
          {rents ? <Table dataSource={rents} columns={columns} scroll={{ x: true }} /> : <Skeleton active />}
        </TabPane>
        <TabPane tab="Owned by me" key="2">
          {rents ? <Table dataSource={rents} columns={columns} scroll={{ x: true }} /> : <Skeleton active />}
        </TabPane>
      </Tabs>
    </>
  )
}

export default Rents
