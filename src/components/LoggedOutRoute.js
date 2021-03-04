import { Route, Redirect } from "react-router-dom"
import { useAuthInfo } from "../hooks/authContext"

const LoggedOutRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuthInfo()
  return (
    <Route
      {...rest}
      render={props =>
        !user ? <Component {...props} /> : <Redirect to='/profile' />
      }
    />
  )
}

export default LoggedOutRoute