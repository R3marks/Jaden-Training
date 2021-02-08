import React, { useContext } from 'react'
import { ApolloClient, ApolloProvider as Provider, HttpLink, InMemoryCache } from '@apollo/client'
import { AuthContext } from './AuthProvider'

function ApolloProvider({ children }) {

    const authContext = useContext(AuthContext)
	console.log(authContext)
	const token = authContext.authInfo.token
	
	const client = new ApolloClient({
		cache: new InMemoryCache(),
		uri: 'http://localhost:9000/graphql',
		credentials: "include"
    })
    
    return (
        <Provider client={client}>{children}</Provider>
    )
}

export default ApolloProvider
