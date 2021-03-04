import { Route, Redirect } from "react-router-dom"
import { useAuthInfo } from "../hooks/authContext"
import { notification } from 'antd'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuthInfo()

  const warnAndRedirect = () => {
    /* notification['error']({
      message: 'Something went wrong',
      description: 'You must be logged in to access this section',
      duration: 5,
      style: {
        borderRadius: '20px'
      }
    }) */

    return <Redirect to='/login' />
  }

  return (
    <Route
      {...rest}
      render={props =>
        user ? <Component {...props} /> : warnAndRedirect()
      }
    />
  )
}

export default PrivateRoute