import { gql } from '@apollo/client'

export const USER_INFO = gql`
    mutation userInfo {
        userInfo {
            user {
                id
                email
            }
        }
    }
`

export const SIGN_IN = gql`
    mutation signIn($credentials: Credentials!) {
        signIn(credentials: $credentials) {
            user {
                id
                email
            }
        }
    }
`

export const SIGN_UP = gql`
    mutation signUp($credentials: Credentials!) {
        signUp(credentials: $credentials) {
            user {
                id
                email
            }
        }
    }
`

export const SIGN_OUT = gql`
    mutation signOut {
        signOut {
            user {
                id
                email
            }
        }
    }
`

export const ADD_TO_CART = gql`
    mutation addToCart($idProvided: ID!) {
        addToCart(id: $idProvided) {
            cart {
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
    }
`

export const REMOVE_FROM_CART = gql`
    mutation removeFromCart($idProvided: ID!) {
        removeFromCart(id: $idProvided) {
            cart {
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
    }
`

export const UPDATE_QUANTITY = gql`
    mutation updateCart($idProvided: ID!, $newQuantity: Int!) {
        updateCart(id: $idProvided, quantity: $newQuantity) {
            cart {
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
    }
`

export const PURCHASE_CART = gql`
    mutation purchaseCart {
        purchaseCart {
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
