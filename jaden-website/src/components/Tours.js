import React from 'react'
import './Tours.css'
import TourQuery from './TourQuery'
import { useQuery } from '@apollo/client'
import { SEARCH_TOURS } from '../graphql/Queries'

function Tours() {

    const { loading, error, data, refetch, networkStatus } = useQuery(SEARCH_TOURS, {
        variables: { searchTerm: "" }
    })

    function handleChange(event) {
        refetch({ searchTerm: event.target.value })
    }

    return (
        <div className="tour-background">
            <div className="tour-wrapper">
                <h1 className="tours-header">TOURS</h1>
                <div className="tours-section">
                    <div className="search">
                        <i className="fas fa-search" />
                        <input placeholder="Search..." className="search-field" onChange={handleChange}>
                        </input>
                    </div>
                    <div className="scroll-box-tickets">
                        <TourQuery data={data} loading={loading} error={error} networkStatus={networkStatus} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tours
