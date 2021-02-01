require('dotenv')
const fs = require('fs')
const { ApolloServer, gql } = require('apollo-server-express');
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const expressJwt = require('express-jwt')
const jwt = require('jsonwebtoken')
const db = require('./db')

const jwtSecret = Buffer.from('cGFzc3dvcmQ=', 'base64')

const app = express()
app.use(cors())
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

const typeDefs = require('./schema')

const resolvers = require('./resolvers')

const apolloServer = new ApolloServer({ typeDefs, resolvers })
apolloServer.applyMiddleware({ app, path: '/graphql' })
app.listen({ port: process.env.PORT || 9000 }, () => console.log(`🚀 Server ready on port 9000`))
