import React from 'react';
import AuthProvider from './api/AuthProvider'
import ApolloProvider from './api/ApolloProvider'
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
