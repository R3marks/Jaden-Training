import React, { useContext } from 'react'
import { ApolloClient, ApolloProvider as Provider, HttpLink, InMemoryCache } from '@apollo/client'
import { AuthContext } from './AuthProvider'

function ApolloProvider({ children }) {

    const authContext = useContext(AuthContext)
	console.log(authContext)
	const token = authContext.authInfo.token
	
	const client = new ApolloClient({
		link: new HttpLink({
			uri: 'http://localhost:9000/graphql',
			headers: token ? { authorization: token } : undefined
		}),
		cache: new InMemoryCache()
    })
    
    return (
        <Provider client={client}>{children}</Provider>
    )
}

export default ApolloProvider
