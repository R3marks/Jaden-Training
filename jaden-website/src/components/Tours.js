import React from 'react'
import './Tours.css'
import TourQuery from './TourQuery'
import { useQuery } from '@apollo/client'
import { SEARCH_TOURS } from '../graphql/Queries'
import { onError } from "@apollo/client/link/error";

function Tours() {

    const { loading, error, data, refetch, networkStatus } = useQuery(SEARCH_TOURS, {
        variables: { searchTerm: "" }
    })

    function newSearch(event) {
        refetch({ searchTerm: event.target.value })
    }

    function checkTourQuery() {
        if (error) {
            return <h1>Server Offline</h1>
        } else {
            return <TourQuery data={data} loading={loading} error={error} networkStatus={networkStatus} />
        }
    }

    onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );
        if (networkError) console.log(`[Network error]: ${networkError}`);
    });

    return (
        <div className="tour-background">
            <div className="tour-wrapper">
                <h1 className="tours-header">TOURS</h1>
                <div className="tours-section">
                    <div className="search">
                        <i className="fas fa-search" />
                        <input placeholder="Search..." className="search-field" onChange={newSearch}>
                        </input>
                    </div>
                    <div className="scroll-box-tickets">
                        {checkTourQuery()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tours
