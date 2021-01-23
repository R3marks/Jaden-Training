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
        addToCart(id: ID!): UpdateCartMutationResponse
        deleteCartItemById(id: ID!): UpdateCartMutationResponse
        updateCartItemQuantityById(id: ID!, quantity: Int!): UpdateCartMutationResponse
    }

    interface MutationResponse {
        code: String!
        success: Boolean!
        message: String!
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
