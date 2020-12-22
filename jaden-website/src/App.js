import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Tour from './components/pages/Tour';
import Merch from './components/pages/Merch';
import Story from './components/pages/Story';

function App() {
  return (
    <>
    <Router>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/tour' exact component={Tour} />
        <Route path='/merch' exact component={Merch} />
        <Route path='/story' exact component={Story} />
      </Switch>
      <Footer />
    </Router>
    </>
  )
}

export default App;
