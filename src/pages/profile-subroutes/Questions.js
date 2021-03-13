import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUserQuestions, answerQuestion } from '../../services/questions'
import { Table, Space, Skeleton, Button, Tabs, Modal, Input, notification } from 'antd'
import { Gradient } from 'react-gradient'

const { TabPane } = Tabs;

const Questions = () => {
  const [questions, setQuestions] = useState(null)
  const [tab, setTab] = useState('renter')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentQuestionId, setCurrentQuestionId] = useState(null)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [confirmLoading, setConfirmLoading] = useState(false)

  const getQuestions = async (role) => {
    try {
      setQuestions(null)
      const {data} = await getUserQuestions(role)
      setQuestions(data.questions)
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
    getQuestions(tab)
  }, [tab])

  const callback = (key) => {
    if (Number(key) === 1) {
      setTab('renter')
    } else {
      setTab('owner')
    }
  }

  const showModal = (id) => {
    setIsModalVisible(true)
    setCurrentQuestionId(id)
  }

  const handleOk = async () => {
    try {
      setConfirmLoading(true)
      await answerQuestion(currentQuestionId, {answer: currentAnswer})
      getQuestions(tab)
      setCurrentQuestionId(null)
      setCurrentAnswer('')
      setConfirmLoading(false)
      setIsModalVisible(false)
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

  const handleCancel = () => {
    setIsModalVisible(false)
    setCurrentQuestionId(null)
    setCurrentAnswer('')
  }

  const writeAnswer = ({ target: { value } }) => {
    setCurrentAnswer(value)
  }

  const renderName = (value, row, index) => {
    const slug = `${row.product._id}-${value.name.replace(/\s+/g, '-').toLowerCase()}`
    return <Link to={`/product/${slug}`}>{value.name}</Link>
  }

  const renderAnswer = (value, row, index) => {
    if (tab === 'owner') {
      if (value) {
        return value
      } else {
        return <Button type="link" onClick={() => showModal(row._id)}>Respond</Button>
      }
    } else {
      if (value) {
        return value
      } else {
        return '-'
      }
    }
  }

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      render: status => status === 'answered' ? 'Answered' : 'Not answered',
      filters: [
        {
          text: 'Answered',
          value: 'answered',
        },
        {
          text: 'Not answered',
          value: 'not-answered',
        }
      ],
      // specify the condition of filtering result
      // here is that finding the status started with `value`
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      filterMultiple: false
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: renderName,
    },
    {
      title: 'Question',
      dataIndex: 'description',
      key: 'description',
      render: description => description,
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
      render: renderAnswer,
    },
    {
      title: tab === 'owner' ? 'User' : 'Owner',
      dataIndex: tab === 'owner' ? 'user' : 'owner',
      key: tab === 'owner' ? 'user' : 'owner',
      render: user => tab === 'owner' ? user.firstName : (user.storeName ? user.storeName : user.firstName),
    }
  ]

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
            Questions
          </Gradient>
        </Space>
      </div>
      <Tabs onChange={callback} type="card" className='questions-table'>
        <TabPane tab="Asked by me" key="1">
          {questions ? <Table columns={columns} dataSource={questions} scroll={{ x: true }} /> : <Skeleton active />}
        </TabPane>
        <TabPane tab="Asked to me" key="2">
          {questions ? <Table columns={columns} dataSource={questions} scroll={{ x: true }} /> : <Skeleton active />}
          <Modal
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            closable={false}
            confirmLoading={confirmLoading}
          >
            <Input.TextArea
              value={currentAnswer}
              onChange={writeAnswer}
              maxLength={1000}
              showCount={true}
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Modal>
        </TabPane>
      </Tabs>
    </>
  )
}

export default Questions
