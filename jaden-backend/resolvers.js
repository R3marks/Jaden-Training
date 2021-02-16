const { ApolloError, AuthenticationError, UserInputError } = require('apollo-server')
const db = require('./db')
const AuthUtils = require('./auth')
const { users, merch } = require('./db')

const Query = {
    tour: (parent, args) => getTourByID(parent, args),
    tours: () => getAllTours(),
    searchTour: (parent, args) => searchTours(parent, args),
    allMerch: () => getAllMerch(),
    allCart: (parent, args, context) => getAllCart(context)
}

function getTourByID(parent, args) {
    try {
    var result = db.tours.get(args.id)
    if (!result) {
        return new ApolloError(`Could not find Tour with ID: ${args.id}`, "DATABASE_ENTRY_NOT_FOUND")
    }
    return result
    } catch (error) {
        return new ApolloError('Could not get tour by ID in database', 'DATABASE_ERROR')
    }
}

function getAllTours() {
    try {
        var result = db.tours.list()
        if (!result) {
            return new ApolloError('Could not find all Tours', 'DATABASE_TABLE_NOT_FOUND')
        }
        return result
    } catch (error) {
        return new ApolloError('Could not get all tours from database', 'DATABASE_ERROR')
    }
}

function searchTours(parent, args) {
    try {
        let results = new Set

        db.tours.list().forEach(tour => {
            for (key in tour) {
                if (tour[key].indexOf(args.search) != -1 && key !== "link") {
                    results.add(tour)
                }
            }
        })
        return results
    } catch (error) {
        return new ApolloError('Could not search through database for tours', 'DATABASE_ERROR')
    }
}

function getAllMerch() {
    try {
        var result = db.merch.list()
        if (!result) {
            return new ApolloError('Could not find all Tours', 'DATABASE_TABLE_NOT_FOUND')
        }
        return result
    } catch (error) {
        return new ApolloError('Could not get all tours from database', 'DATABASE_ERROR')
    }
}

function getAllCart(context) {
    try {
        if (!context.user) {
            return new AuthenticationError('User has not logged in')
        }
        var user = db.users.get(context.user.sub)
        return user.cart
    } catch (error) {
        return new ApolloError(`Could not retrieve cart from database due to ${error}`, 'DATABASE_ERROR')
    }
}

const Mutation = {
    userInfo: (parent, args, context) => userInfo(context),
    signUp: (parent, args, context) => signUp(args, context),
    signIn: (parent, args, context) => signIn(args, context),
    signOut: (parent, args, context) => signOut(context),
    addToCart: (parent, args, context) => addToCart(args, context),
    removeFromCart: (parent, args, context) => removeFromCart(args, context),
    updateCart: (parent, args, context) => updateCart(args, context),
    purchaseCart: () => purchaseCart()
}

function userInfo(context) {
    if (context.user) {
        return {
            code: 'AUTHENTICATED',
            success: true,
            message: 'User has an authenticated token stored locally within cookies',
            user: { 
                id: context.user.sub,
                email: context.user.email 
            }
        }
    }
    return {         
        code: 'UNAUTHENTICATED',
        success: false,
        message: 'User has no authenticated token stored locally within cookies',
        user: null
    }
}

function signUp(args, context) {
    try {
        let existingUser = false
        var users = db.users.list() // check email does not exist
        users.forEach(user => {
            if (user.email === args.credentials.email) {
                return existingUser = true
            }
        })
        if (existingUser) {
            return new UserInputError('Email already registered', {
                invalidArgs: 'Email'
            })
        }
        var hash = AuthUtils.hashPassword(args.credentials.password)
        var user = db.users.create({ email: args.credentials.email, password: hash, cart: null })
        var token = AuthUtils.createToken(user)
        context.res.cookie('token', token, {
            httpOnly: true
        })
        return {
            code: "SUCCESSFUL_SIGN_UP",
            success: true,
            message: `User with email: ${args.credentials.email} successfully signed up`,
            user: {
                id: user,
                email: args.credentials.email
            }
        }
    } catch (error) {
        return new ApolloError(`Could not create new user due to: ${error}`, 'DATABASE_COULD_NOT_SIGN_UP')
    }
}

function signIn(args, context) {
    try {
        let existingUser
        var users = db.users.list() // check email exists
        users.forEach(user => {
            if (user.email === args.credentials.email) {
                return existingUser = user
            }
        })
        if (!existingUser) {
            return new UserInputError('Email not registered', {
                invalidArgs: 'Email'
            })
        }
        var isValidPassword = AuthUtils.verifyPassword(args.credentials.password, existingUser.password)
        if (!isValidPassword) {
            return new UserInputError('Password incorrect', {
                invalidArgs: 'Password'
            })
        }
        var token = AuthUtils.createToken(existingUser)
        context.res.cookie('token', token, {
            httpOnly: true
        })
        return {
            code: "SUCCESSFUL_SIGN_IN",
            success: true,
            message: `User with email: ${existingUser.email} successfully signed in`,
            user: {
                id: existingUser.id,
                email: existingUser.email
            }
        }
    } catch (error) {
        return new ApolloError(`Could not sign user in because: ${error}`, 'DATABASE_COULD_NOT_SIGN_IN')
    }
}

function signOut(context) {
    context.res.clearCookie('token')
    return { user: undefined }
}

function addToCart(args, context) {
    try {
        if (!context.user) {
            return new AuthenticationError('User has not logged in')
        }
        var user = db.users.get(context.user.sub)
        if (user.cart === null) {
            var newCart = db.cart.create({ 
                user: { 
                    id: user.id,
                    email: user.email
                }, 
                cartItems: [],
                total: 0.00 })
            var usersCart = db.cart.get(newCart)
            db.users.update({id: user.id, email: user.email, password: user.password, cart: usersCart })
        } else {
            var usersCart = user.cart
        }
        var merchById = db.merch.get(args.id)
        db.cart.update({ 
            id: usersCart.id,
            user: {
                id: user.id,
                email: user.email
            },
            cartItems: [...usersCart.cartItems, {
                id: merchById.id,
                src: merchById.src, 
                name: merchById.name, 
                price: merchById.price, 
                quantity: 1
            }],
            total: usersCart.total + merchById.price
        })
        var updatedCart = db.cart.get(usersCart.id)
        db.users.update({
            id: user.id,
            email: user.email,
            password: user.password,
            cart: updatedCart
        })
        var result = {
            code: "SUCCESSFULLY_ADDED_TO_CART",
            success: true,
            message: `You have successfully added ${merchById.name} to the cart`,
            cart: updatedCart
        }
        return result
    } catch (error) {
        return new ApolloError(`Could not add to cart because of an error: ${error}`, 'DATABASE_COULD_NOT_CREATE')
    }
}

function removeFromCart(args, context) {
    try {
        if (!context.user) {
            return new AuthenticationError('User has not logged in')
        }
        var user = db.users.get(context.user.sub)
        var usersCartitems = user.cart.cartItems
        var updatedCartItems = usersCartitems.filter(item => item.id !== args.id)
        var newTotal = 0.00
        updatedCartItems.forEach(item => {
            itemPrice = item.price * item.quantity
            newTotal += itemPrice
        })
        db.cart.update({
            id: user.cart.id,
            user: {
                id: user.id,
                email: user.id
            },
            cartItems: updatedCartItems,
            total: newTotal
        })
        var cart = db.cart.get(user.cart.id)
        db.users.update({
            id: user.id,
            email: user.email,
            password: user.password,
            cart: cart
        })
        var result = {
            code: "200",
            success: true,
            message: `You have successfully deleted the cart entry: ${args.id}`,
            cart: cart
        }
        return result
    } catch (error) {
        return new ApolloError(`Could not delete entry with ID: ${args.id} because of error: ${error}`, 'DATABASE_COULD_NOT_DELETE')
    }
}

function updateCart(args, context) {
    try {
        if (!context.user) {
            return new AuthenticationError('User has not logged in')
        }
        var user = db.users.get(context.user.sub)
        var usersCartitems = user.cart.cartItems
        var updatedCartItems = usersCartitems.map(item => {
            if (item.id === args.id) {
                item.quantity = args.quantity
            }
            return item
        })
        var newTotal = 0.00
        updatedCartItems.forEach(item => {
            itemPrice = item.price * item.quantity
            newTotal += itemPrice
        })
        db.cart.update({
            id: user.cart.id,
            user: {
                id: user.id,
                email: user.id
            },
            cartItems: updatedCartItems,
            total: newTotal
        })
        var cart = db.cart.get(user.cart.id)
        console.log(cart)
        db.users.update({
            id: user.id,
            email: user.email,
            password: user.password,
            cart: cart
        })
        var result = {
            code: "200",
            success: true,
            message: `You have successfully deleted the cart entry: ${args.id}`,
            cart: cart
        }
        return result
        // var cartEntry = db.cart.get(args.id)
        // db.cart.update({ id: args.id, src: cartEntry.src, name: cartEntry.name, price: cartEntry.price, quantity: args.quantity })
        // var cart = db.cart.list()
        // var result = {
        //     code: "200",
        //     success: true,
        //     message: `You have successfully changed the quantity of: ${args.id}, to ${args.quantity}`,
        //     cart: cart
        // }
        // return result
    } catch (error) {
        return new ApolloError(`Could not update quantity of entry with ID: ${args.id} to ${args.quantity} because of error: ${error}`, 'DATABASE_COULD_NOT_UPDATE')
    }
}

function purchaseCart() {
    try {
        var cartToPurchase = db.cart.list()
        var ids = cartToPurchase.map(cartEntry => {
            return cartEntry.id
        })
        ids.forEach((id) => {
            db.cart.delete(id) // iteration separated bc of notarealdb
        })
        var cart = db.cart.list()
        var result = {
            code: "200",
            success: true,
            message: `You have successfully purchased the items in your cart`,
            cart: cart
        }
        return result
    } catch (error) {
        return new ApolloError(`Could not purchase items placed in your cart`, 'DATABASE_COULD_NOT_PURCHASE')
    }
}

const MutationResponse = {
    __resolveType(mutationResponse, context, info) {
        return null
    }
}

module.exports = { Query, Mutation, MutationResponse }