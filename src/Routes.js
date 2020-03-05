import React from 'react'

import { Router, Switch, Route } from 'react-router'

import Login from './pages/login'
import NotFound from './components/NotFounds'
import PrivateRoute from './components/PrivateRoutes'

import {history} from './history'
import PessoaBox from './components/Pessoa'

const Routes = () => (
    <Router history={ history }>
        <Switch>
            <Route component={Login} exact path="/login"/>
            <PrivateRoute component={PessoaBox} exact path="/pessoa"/>
            <PrivateRoute component={NotFound}/>
        </Switch>
    </Router>
)

export default Routes