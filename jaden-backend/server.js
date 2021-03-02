require('dotenv')
const { ApolloServer } = require('apollo-server-express');
const ConstraintDirective = require('apollo-server-constraint-directive')
const cors = require('cors')
const express = require('express')
const auth = require('./auth')
const cookieParser = require('cookie-parser')
const path = require('path')

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true // <-- REQUIRED backend setting
  };

const app = express()
app.use(cors(corsOptions), cookieParser())

const typeDefs = require('./schema')

const resolvers = require('./resolvers')

const apolloServer = new ApolloServer({ 
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

// The public folder is only used in a production environment. For development, comment out the below app.use and app.get
app.use(express.static('public'))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.listen({ port: process.env.PORT || 9000 }, () => console.log(`🚀 Server ready on port ${process.env.PORT}`))
