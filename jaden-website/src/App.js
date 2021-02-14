import React from 'react';
import AuthProvider from './components/AuthProvider'
import ApolloProvider from './components/ApolloProvider'
import AppRouter from './components/AppRouter'


function App() {
    return (
		<AuthProvider>
			<ApolloProvider>
				<AppRouter />
			</ApolloProvider>
		</AuthProvider>
    )
}

export default App;
