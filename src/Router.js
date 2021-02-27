import {BrowserRouter, Switch, Route} from 'react-router-dom'
import LayoutApp from './components/LayoutApp'
import Home from './pages/Home'
import Login from './pages/Login'

const Signupt = () => <h1>Signupt</h1>
const Profile = () => <h1>Profile</h1>

function Router() {
  return (
    <BrowserRouter>
      <LayoutApp>
        <Switch>
          <Route component={Home} path='/' exact/>
          <Route component={Signupt} path='/signupt'/>
          <Route component={Login} path='/login'/>
          <Route component={Profile} path='/profile'/>
        </Switch>
      </LayoutApp>
    </BrowserRouter>
  )
}

export default Router