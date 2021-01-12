require('dotenv').config()
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLScalarType
} = require('graphql')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const TOUR = [{
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

// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name: 'HelloWorld',
//         fields: () => ({
//             message: { 
//                 type: GraphQLString ,
//                 resolve: () => 'Hello World'
//             }
//         })
//     })
// })

const TourType = new GraphQLObjectType({
    name: 'Tour',
    description: 'Represents a tour date',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) }, 
        date: { type: GraphQLNonNull(GraphQLString) },
        city: { type: GraphQLNonNull(GraphQLString) },
        link: { type: GraphQLNonNull(GraphQLString) },
        arena: { type: GraphQLNonNull(GraphQLString) },
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        tour: {
            type: TourType,
            description: 'Tour',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => TOUR.find(tour => tour.id === args.id)
        },
        tours: {
            type: new GraphQLList(TourType),
            description: 'List of Tours',
            resolve: () => TOUR
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addTour: {
            type: TourType,
            description: 'Add a book',
            args: {
                date: { type: GraphQLNonNull(GraphQLString) },
                city: { type: GraphQLNonNull(GraphQLString) },
                link: { type: GraphQLNonNull(GraphQLString) },
                arena: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                const tour = { id: TOUR.length + 1, date: args.date, city: args.city, link: args.link, arena: args.arena }
                TOUR.push(tour)
                return tour
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

// Database
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true,     useUnifiedTopology: true })
// const db = mongoose.connection
// db.on('error', (error) => console.error(error))
// db.once('open', () => console.log('Connected to database'))

// app.use(express.json())
// app.use(cors)
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

// const merchRouter = require('./routes/merch.js')
// app.use('/merch', merchRouter)

app.listen(5000, () => console.log('Server started'))
