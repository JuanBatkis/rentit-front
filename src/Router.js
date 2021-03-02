import { useEffect } from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import { getCurrentUser } from './services/auth'
import LayoutApp from './components/LayoutApp'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'

const Profile = () => <h1>Profile</h1>

function Router() {
  useEffect(() => {
    async function getData() {
      const { data } = await getCurrentUser()
      console.log(data)
    }
    getData()
  })
  return (
    <BrowserRouter>
      <LayoutApp>
        <Switch>
          <Route component={Home} path='/' exact/>
          <Route component={Signup} path='/signup'/>
          <Route component={Login} path='/login'/>
          <Route component={Profile} path='/profile'/>
        </Switch>
      </LayoutApp>
    </BrowserRouter>
  )
}

export default Router