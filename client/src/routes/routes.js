import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from '../components/Login/login';
import Register from '../components/Register/register';
import Dashboard from '../components/Dashboard/dashboard';

const Routes = (
    <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route path='/dashboard' component={Dashboard} />
    </Switch>
);

export default Routes;