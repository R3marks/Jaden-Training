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

export const GET_MERCH = gql`
    query {
        allMerch {
            id
            src
            name
            price
        }
    }
`

export const GET_CART = gql`
    query {
        allCart {
            user {
                id
                email
            }
            cartItems {
                id
                src
                name
                price
                quantity
            }
            total
        }
    }
`