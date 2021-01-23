import { gql } from '@apollo/client'

export const ADD_TO_CART = gql`
    mutation addToCart($idProvided: ID!) {
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

export const REMOVE_FROM_CART = gql`
    mutation deleteCartItemById($idProvided: ID!) {
        deleteCartItemById(id: $idProvided) {
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

export const UPDATE_QUANTITY = gql`
    mutation updateCartItemQuantityById($idProvided: ID!, $newQuantity: Int!) {
        updateCartItemQuantityById(id: $idProvided, quantity: $newQuantity) {
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
