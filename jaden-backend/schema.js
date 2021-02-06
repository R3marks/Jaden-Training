const { gql } = require('apollo-server') 

module.exports = gql`
    type Query {
        tour(id: ID!): Tour
        tours: [Tour]
        searchTour(search: String!): [Tour]
        allMerch: [Merch]
        allCart: [Cart]
    }

    type Mutation {
        userInfo: AuthPayload
        signUp(credentials: Credentials!): AuthPayload
        signIn(credentials: Credentials!): AuthPayload
        signOut: AuthPayload
        addToCart(id: ID!): UpdateCartMutationResponse
        deleteCartItemById(id: ID!): UpdateCartMutationResponse
        updateCartItemQuantityById(id: ID!, quantity: Int!): UpdateCartMutationResponse
        purchaseCart: UpdateCartMutationResponse
    }

    interface MutationResponse {
        code: String!
        success: Boolean!
        message: String!
    }

    type User {
        id: ID!
        email: String!
        password: String!
    }

    input Credentials {
        email: String!
        password: String!
    }

    type AuthPayload implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        user: User
    }

    type Tour {
        id: ID!
        date: String!
        city: String!
        link: String!
        arena: String!
    }

    type Merch {
        id: ID!
        src: String!
        name: String!
        price: Float!
    }

    type Cart {
        id: ID!
        src: String!
        name: String!
        price: Float!
        quantity: Int!
    }

    type UpdateCartMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        cart: [Cart]
    }
`
