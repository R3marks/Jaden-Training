import React, { useContext } from 'react';
import Footer from './components/Footer'; 
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AuthProvider from './components/AuthProvider'
import ApolloProvider from './components/ApolloProvider'
import Home from './components/pages/Home';
import Tour from './components/pages/Tour';
import Merch from './components/pages/Merch';
import Story from './components/pages/Story';
import SignUp from './components/pages/SignUp'

function App() {
    return (
		<AuthProvider>
			<ApolloProvider>
				<Router>
					<Switch>
						<Route path='/' exact component={Home} />
						<Route path='/tour' exact component={Tour} />
						<Route path='/merch' exact component={Merch} />
						<Route path='/story' exact component={Story} />
						<Route path='/sign-up' exact component={SignUp} />
					</Switch>
					<Footer />
				</Router>
			</ApolloProvider>
		</AuthProvider>
    )
}

export default App;
