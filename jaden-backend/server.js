const fs = require('fs')
const { ApolloServer, gql } = require('apollo-server-express');
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const expressJwt = require('express-jwt')
const jwt = require('jsonwebtoken')
const db = require('./db')

const port = 9000;
const jwtSecret = Buffer.from('cGFzc3dvcmQ=', 'base64')

const app = express()
// app.use(cors(), bodyParser.json(), expressJwt({
//     secret: jwtSecret,
//     credentialsRequired: false
// }))

// app.post('/login', (req, res) => {
//   const { email, password} = req.body
//   const user = db.users.list().find((user) => user.email === email)
//   if (!(user && user.password === password)) {
//     res.sendStatus(401)
//     return
//   }
//   const token = jet.sign({ sub: user.id }, jwtSecret)
//   res.send({ token })
// })

const typeDefs = gql(fs.readFileSync('./schema.graphql', { encoding: 'utf-8'}))

const resolvers = require('./resolvers')

const apolloServer = new ApolloServer({ typeDefs, resolvers })
apolloServer.applyMiddleware({ app, path: '/graphql' })
console.log(port)
app.listen(port, () => console.log(`🚀 Server ready on port ${port}`))

// const typeDefs = gql`
//     type Tour {
//         date: String
//         city: String
//         link: String
//         arena: String
//     }

//     type Query {
//         tours: [Tour]
//     }

//     interface MutationResponse {
//         code: String!
//         success: Boolean!
//         message: String!
//     }

//     type UpdateUserEmailMutationResponse implements MutationResponse {
//         code: String!
//         success: Boolean!
//         message: String!
//         user: User
//     }
// `  


