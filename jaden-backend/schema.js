const { gql } = require('apollo-server') 

module.exports = gql`
    type Query {
        tour(id: ID!): Tour
        tours: [Tour]
        searchTour(search: String!): [Tour]
        allMerch: [Merch]
    }

    type Tour {
        id: ID!,
        date: String!,
        city: String!,
        link: String!,
        arena: String!,
    }

    type Merch {
        id: ID!
        src: String!,
        name: String!,
        price: Float!
    }
`
