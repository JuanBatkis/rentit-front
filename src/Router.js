import {BrowserRouter, Switch, Route} from 'react-router-dom'
import LayoutApp from './components/LayoutApp'
import PrivateRoute from './components/PrivateRoute'
import LoggedOutRoute from './components/LoggedOutRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Activate from './pages/Activate'
import Profile from './pages/Profile'
import Products from './pages/Products'
import Product from './pages/Product'

function Router() {
  return (
    <BrowserRouter>
      <LayoutApp>
        <Switch>
          <Route component={Home} path='/' exact/>
          <LoggedOutRoute component={Login} path='/login'/>
          <LoggedOutRoute component={Signup} path='/signup'/>
          <LoggedOutRoute component={Activate} path='/activate/:id'/>
          <PrivateRoute component={Profile} path='/profile'/>
          <Route component={Products} path='/products'/>
          <Route component={Product} path='/product/:id'/>
        </Switch>
      </LayoutApp>
    </BrowserRouter>
  )
}

export default Router