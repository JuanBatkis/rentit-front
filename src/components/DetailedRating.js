import { Rate, Typography } from 'antd'

const { Text } = Typography

const DetailedRating = ({ rating }) => {
  const ratingsCount = rating.one + rating.two + rating.three + rating.four + rating.five

  return (
    <div>
      <Rate allowHalf disabled defaultValue={rating.total} />
      <Text>{ratingsCount === 1 ? ` (${ratingsCount} rating)` : ` (${ratingsCount} ratings)`}</Text>
    </div>
  )
}

export default DetailedRating
