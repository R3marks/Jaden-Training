const { gql } = require('apollo-server') 

module.exports = gql`

    # scalar ValidateString
    # scalar ValidateNumber

    directive @constraint(
        # String constraints
        minLength: Int
        maxLength: Int
        startsWith: String
        endsWith: String
        notContains: String
        pattern: String
        format: String

        # Number constraints
        min: Int
        max: Int
        exclusiveMin: Int
        exclusiveMax: Int
        multipleOf: Int
    ) on INPUT_FIELD_DEFINITION
    
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
        email: String! @constraint(format: "email")
        password: String! @constraint(minLength: 8)
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
