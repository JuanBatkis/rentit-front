import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from "axios"
import { createProduct } from '../../services/products'
import { Form, Input, Button, Select, Row, Col, InputNumber, Space, Upload, Modal, notification } from 'antd'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'

const { Option } = Select

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 24 },
}
const tailLayout = {
  wrapperCol: { offset: 0, span: 16 },
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const AddProduct = () => {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([])
  const [loading, setLoading] = useState(false)

  const {push} = useHistory()

  const handleCancel = () => setPreviewVisible(false)

  const handleUpload = async file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
    if (!isJpgOrPng) {
      return (notification['error']({
        message: 'Something went wrong',
        description: 'You can only upload a JPG/PNG/WEBP file!',
        duration: 5,
        style: {
          borderRadius: '20px'
        }
      }))
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      return (notification['error']({
        message: 'Something went wrong',
        description: 'Image must smaller than 2MB!',
        duration: 5,
        style: {
          borderRadius: '20px'
        }
      }))
    }

    const fdata = new FormData()
    fdata.append("file", file)
    const cloudinaryApi = "https://api.cloudinary.com/v1_1/djv6xyyqp/image/upload"
    fdata.append("upload_preset", "rentit_product")
    setLoading(true)
    const { data } = await axios.post(cloudinaryApi, fdata)
  
    let newFileList = fileList
    newFileList.push(
      {
        uid: data.asset_id,
        name: data.original_filename,
        status: 'done',
        url: data.secure_url,
      }
    )
    setFileList(newFileList)
    setLoading(false)
  }

  const handleDelete = (file) => {
    console.log('hey');
    console.log(file);
    console.log(fileList);
    const newFileList = fileList.filter(image => image.uid !== file.uid)
    console.log(newFileList);
    setFileList(newFileList)
  }

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  const onFinish = async (values) => {
    values.images = fileList.map(image => image.url)
    console.log('Success:', values);
    try {
      await createProduct(values)
      notification['success']({
        message: 'Product created!',
        description: `${values.name} has been added successfully to your available rentals 🎉`,
        duration: 5,
        style: {
          borderRadius: '20px'
        }
      })
      push('/profile/products')
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

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  }

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout='vertical'
    >
      <Form.Item
        label="Product name:"
        name="name"
        rules={[{ required: true, message: 'Please input the product name!' }]}
      >
        <Input size="large" />
      </Form.Item>

      <Row gutter={6}>
        <Col span={12}>
          <Form.Item
            label="Price per hour:"
            name="priceHour"
            rules={[{ required: true, message: 'Please input the price per hour!' }]}
          >
            <InputNumber
              defaultValue={1}
              min={0}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              style={{ width: '100%' }}
            />
          </Form.Item>  
        </Col>
        <Col span={12}>
        <Form.Item
            label="Price per day:"
            name="priceDay"
          >
            <InputNumber
              min={0}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              style={{ width: '100%' }}
            />
          </Form.Item> 
        </Col>
      </Row>

      <Form.Item
        label="Category"
        name="category"
        rules={[{ required: true, message: 'Please select a category!' }]}
      >
        <Select placeholder="Please select a category">
          <Option value="tools">Tools</Option>
          <Option value="technology">Technology</Option>
          <Option value="vehicles">Vehicles</Option>
          <Option value="sports">Sports</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please input a description!' }]}
      >
        <Input.TextArea
          maxLength={2000}
          showCount={true}
          autoSize={{ minRows: 3, maxRows: 8 }}
        />
      </Form.Item>

      <Upload
        //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        beforeUpload={handleUpload}
        onPreview={handlePreview}
        method='get'
        onRemove={handleDelete}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>

      <Form.Item {...tailLayout}>
        <Space size="middle">
          <Button type="primary" htmlType="submit" size={'large'} shape="round">
            Create
          </Button>
          <Button danger size={'large'} shape="round">
            <Link to='/profile/products/'>Cancel</Link>
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default AddProduct
