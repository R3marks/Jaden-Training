require('dotenv')
const fs = require('fs')
const { ApolloServer, gql } = require('apollo-server-express');
const ConstraintDirective = require('apollo-server-constraint-directive')
const { makeExecutableSchema } = require('apollo-server')
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const expressJwt = require('express-jwt')
const jwt = require('jsonwebtoken')
const db = require('./db')
const auth = require('./auth')
const cookieParser = require('cookie-parser')

const jwtSecret = Buffer.from('cGFzc3dvcmQ=', 'base64')

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true // <-- REQUIRED backend setting
  };

const app = express()
app.use(cors(corsOptions), cookieParser())
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

const schemaDirectives = {
    constraint: ConstraintDirective,
  };

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives,
    // context: ({ req, res }) => {
    //     let user = null
    //     if (req.cookies.token) {
    //         const payload = auth.verifyToken(req.cookies.token)
    //         user = payload
    //     }
    //     return { user, res }
    // }
})

const apolloServer = new ApolloServer({ 
    // schema,
    typeDefs,
    resolvers,
    schemaDirectives: { constraint: ConstraintDirective },
    playground: true,
    context: ({ req, res }) => {
        let user = null
        if (req.cookies.token) {
            const payload = auth.verifyToken(req.cookies.token)
            user = payload
        }
        return { user, res }
    },
    formatError: (err) => {
        if (err.extensions.exception.name === 'CustomDirectiveError') {
            var validationError = err.extensions.exception.stacktrace[0].split(': ')
            err.message = validationError[1].charAt(0).toUpperCase() + validationError[1].slice(1)
        }
        // What used to work
        // if (err.extensions.code === 'GRAPHQL_VALIDATION_FAILED') {
        //     var validationError = err.extensions.exception.stacktrace[0].split(': ')
        //     if (validationError[0] === 'CustomDirectiveError')
        //     var newErrorMessage = validationError[1]
        //     err.message = newErrorMessage.charAt(0).toUpperCase() + newErrorMessage.slice(1)
        // }
        return err
    }
 })

// Apollo server has its own cors implementation and therefore you need to turn it off if you have cors set up already
apolloServer.applyMiddleware({ app, path: '/graphql', cors: false })
app.listen({ port: process.env.PORT || 9000 }, () => console.log(`🚀 Server ready on port 9000`))
