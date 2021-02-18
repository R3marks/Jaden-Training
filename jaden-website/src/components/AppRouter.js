import React, { useContext } from 'react'
import Footer from './Footer'; 
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthContext } from './AuthProvider'
import useAppInit from './useAppInit'
import Home from './pages/Home';
import Tour from './pages/Tour';
import Merch from './pages/Merch';
import Story from './pages/Story';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';

function AppRouter() {

    var { loading } = useAppInit()
    const { isAuthenticated } = useContext(AuthContext)
    var authenticated = isAuthenticated()

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
                <Route path={authenticated ? '/profile' : '/sign-in'} exact component={authenticated ? Profile : SignIn} />
            </Switch>)}
            <Footer />
        </Router>
    )
}

export default AppRouter
