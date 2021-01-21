import { gql } from '@apollo/client'

export const ADD_TO_CART = gql`
    mutation AddToCart($idProvided: ID!) {
        addToCart(id: $idProvided) {
            cart {
                id
                src 
                name 
                price 
                quantity
            }
        }
    }
`