import React from 'react'
import { ApolloClient, ApolloProvider as Provider, InMemoryCache } from '@apollo/client'
import { HttpLink } from 'apollo-link-http';
import { onError } from "@apollo/client/link/error";
import { from } from 'apollo-link';

function ApolloProvider({ children }) {

	const link = new HttpLink({
		uri: '/graphql',
		credentials: "include"
	})

	const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );
        if (networkError) console.log(`[Network error]: ${networkError}`);
    });
	
	const client = new ApolloClient({
		cache: new InMemoryCache(),
		link: from([errorLink, link])
    })
    
    return (
        <Provider client={client}>{children}</Provider>
    )
}

export default ApolloProvider
