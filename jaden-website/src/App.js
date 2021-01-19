import React from 'react';
import Footer from './components/Footer';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Tour from './components/pages/Tour';
import Merch from './components/pages/Merch';
import Story from './components/pages/Story';


const client = new ApolloClient({
  uri: 'http://localhost:9000/graphql',
  cache: new InMemoryCache()
})

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/tour' exact component={Tour} />
          <Route path='/merch' exact component={Merch} />
          <Route path='/story' exact component={Story} />
        </Switch>
        <Footer />
      </Router>
    </ApolloProvider>
  )
}

export default App;
