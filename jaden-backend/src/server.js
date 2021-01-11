const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Tour {
    date: String
    city: String
    link: String
    arena: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    tours: [Tour]
  }
`;

const TOURS = [{
    id: 1,
    date: "MAY 26",
    city: "SAN DIEGO, CA",
    link: "https://goo.gl/maps/jDKwrSR9XokpJpEr6",
    arena: "PECHANGA ARENA"
}, {
    id: 2,
    date: "JUN 19",
    city: "MINNEAPOLIS, MN",
    link: "https://g.page/TargetCenterMN?share",
    arena: "TARGET CENTER"
}, {
    id: 3,
    date: "JUN 28",
    city: "DETROIT, MN",
    link: "https://goo.gl/maps/9TE2az6pbm65J3jCA",
    arena: "LITTLE CAESARS ARENA"
}, {
    id: 4,
    date: "JUN 29",
    city: "COLOMBUS, OH",
    link: "https://goo.gl/maps/YSGcvvHXZJBYycZN7",
    arena: "THE SCHOTTENSTEIN CENTER"
}]
  
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        tours: () => TOURS,
    },
};
  
  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

