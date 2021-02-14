import React from 'react'
import Footer from './Footer'; 
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useAppInit from './useAppInit'
import Home from './pages/Home';
import Tour from './pages/Tour';
import Merch from './pages/Merch';
import Story from './pages/Story';
import SignUp from './pages/SignUp';

function AppRouter() {

    var { loading } = useAppInit()

    return (
        <Router>
            {loading ? (
                <h1>Loading User Data</h1>
            ) : (
            <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/tour' exact component={Tour} />
                <Route path='/merch' exact component={Merch} />
                <Route path='/story' exact component={Story} />
                <Route path='/sign-up' exact component={SignUp} />
            </Switch>)}
            <Footer />
        </Router>
    )
}

export default AppRouter
