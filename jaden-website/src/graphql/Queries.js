import { gql } from '@apollo/client'

export const SEARCH_TOURS = gql`
    query searchTour($searchTerm: String!) {
        searchTour(search: $searchTerm) {
            date
            city
            link
            arena
        }
    }
`
const CHECK = ''

export default { SEARCH_TOURS, CHECK }