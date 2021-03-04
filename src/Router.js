import {BrowserRouter, Switch, Route} from 'react-router-dom'
import LayoutApp from './components/LayoutApp'
import PrivateRoute from './components/PrivateRoute'
import LoggedOutRoute from './components/LoggedOutRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'

function Router() {
  return (
    <BrowserRouter>
      <LayoutApp>
        <Switch>
          <Route component={Home} path='/' exact/>
          <LoggedOutRoute component={Signup} path='/signup'/>
          <LoggedOutRoute component={Login} path='/login'/>
          <PrivateRoute component={Profile} path='/profile'/>
        </Switch>
      </LayoutApp>
    </BrowserRouter>
  )
}

export default Router