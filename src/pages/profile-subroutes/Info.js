import { useState } from 'react'
import { useAuthInfo } from '../../hooks/authContext'
import { Typography, Divider } from 'antd'
import { Gradient } from 'react-gradient'
import DetailedRating from '../../components/DetailedRating'

const { Title, Text } = Typography

const Info = () => {
  const {user} = useAuthInfo()
  const [editableFirstName, setEditableFirstName] = useState(user.firstName)
  const [editableLasttName, setEditableLastName] = useState(user.lastName)
  const [editablestoreName, setEditablestoreName] = useState(user.storeName)
  const [editablePhone, setEditablePhone] = useState(user.phone)

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
      <Title level={2}>User info:</Title>
      <Title level={4}>First name:</Title>
      <Text editable={{ onChange: setEditableFirstName }}>{editableFirstName}</Text>
      <Title level={4}>Last name:</Title>
      <Text editable={{ onChange: setEditableLastName }}>{editableLasttName}</Text>
      <Title level={4}>Store name:</Title>
      <Text editable={{ onChange: setEditablestoreName }}>{editablestoreName}</Text>
      <Title level={4}>Phone number:</Title>
      <Text editable={{ onChange: setEditablePhone }}>{editablePhone}</Text>
    </>
  )
}

export default Info
