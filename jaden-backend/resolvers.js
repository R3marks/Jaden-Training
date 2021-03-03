const { ApolloError, AuthenticationError, UserInputError } = require('apollo-server')
const db = require('./db')
const AuthUtils = require('./auth')

const Query = {
    tour: (parent, args) => tour(args),
    tours: () => tours(),
    searchTour: (parent, args) => searchTour(args),
    allMerch: () => allMerch(),
    allCart: (parent, args, context) => allCart(context)
}

function tour(args) {
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

function tours() {
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

function searchTour(args) {
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

function allMerch() {
    try {
        var result = db.merch.list()
        if (!result) {
            return new ApolloError('Could not find all Merch', 'DATABASE_TABLE_NOT_FOUND')
        }
        return result
    } catch (error) {
        return new ApolloError('Could not get all Merch from database', 'DATABASE_ERROR')
    }
}

function allCart(context) {
    try {
        if (!context.user) {
            return new AuthenticationError('User has not logged in')
        }
        var user = db.users.get(context.user.sub)
        if (!user.cart) {
            return {
                user: {
                    id: user.id,
                    email: user.email
                },
                cartItems: [],
                total: 0.00
            }
        }
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
    purchaseCart: (parent, args, context) => purchaseCart(context),
    deleteUser: (parent, args, context) => deleteUser(context)
}

function userInfo(context) {
    if (context.user) {
        try {
            var user = db.users.get(context.user.sub)
            return {
                code: 'AUTHENTICATED',
                success: true,
                message: 'User has an authenticated token stored locally within cookies',
                user: { 
                    id: context.user.sub,
                    email: context.user.email,
                    cart: {
                        total: user.cart ? user.cart.total : 0.00
                    }
                }
            }
        } catch (error) {
            return new ApolloError('Could not retrieve user\'s info', 'DATABASE_CANT_FIND_USER')
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
        var users = db.users.list()
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
        var userId = db.users.create({ email: args.credentials.email, password: hash, cart: null })
        var user = db.users.get(userId)
        var token = AuthUtils.createToken(user)
        context.res.cookie('token', token, {
            httpOnly: true
        })
        return {
            code: "SUCCESSFUL_SIGN_UP",
            success: true,
            message: `User with email: ${args.credentials.email} successfully signed up`,
            user: {
                id: userId,
                email: user.email
            }
        }
    } catch (error) {
        return new ApolloError(`Could not create new user due to: ${error}`, 'DATABASE_COULD_NOT_SIGN_UP')
    }
}

function signIn(args, context) {
    try {
        let existingUser
        var users = db.users.list()
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
        if (!user.cart) {
            var newCart = db.cart.create({ 
                user: { 
                    id: user.id,
                    email: user.email
                }, 
                cartItems: [],
                total: 0.00 
            })
            var usersCart = db.cart.get(newCart)
            db.users.update({ id: user.id, email: user.email, password: user.password, cart: usersCart })
        } else {
            var usersCart = user.cart
        }
        var merchById = db.merch.get(args.id)
        var usersCartItems = usersCart.cartItems
        let itemAlreadyInCart = false
        usersCartItems.map(item => {
            if (item.id === args.id) {
                item.quantity += 1
                itemAlreadyInCart = true
            }
            return item
        })
        if (!itemAlreadyInCart) {
            db.cart.update({ 
                id: usersCart.id,
                user: {
                    id: user.id,
                    email: user.email
                },
                cartItems: [...usersCartItems, {
                    id: merchById.id,
                    src: merchById.src, 
                    name: merchById.name, 
                    price: merchById.price, 
                    quantity: 1
                }],
                total: usersCart.total + merchById.price
            })
        } else {
            var newTotal = 0.00
            usersCartItems.forEach(item => {
                totalItemPrice = item.price * item.quantity
                newTotal += totalItemPrice
            })
            db.cart.update({ 
                id: usersCart.id,
                user: {
                    id: user.id,
                    email: user.email
                },
                cartItems: usersCartItems,
                total: newTotal
            })
        }
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
        var usersCartItems = user.cart.cartItems
        var updatedCartItems = usersCartItems.filter(item => item.id !== args.id)
        var newTotal = 0.00
        updatedCartItems.forEach(item => {
            totalItemPrice = item.price * item.quantity
            newTotal += totalItemPrice
        })
        db.cart.update({
            id: user.cart.id,
            user: {
                id: user.id,
                email: user.email
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
            code: 'SUCCESSFULLY_REMOVED_FROM_CART',
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
        var usersCartItems = user.cart.cartItems
        var updatedCartItems = usersCartItems.map(item => {
            if (item.id === args.id) {
                item.quantity = args.quantity
            }
            return item
        })
        var newTotal = 0.00
        updatedCartItems.forEach(item => {
            totalItemPrice = item.price * item.quantity
            newTotal += totalItemPrice
        })
        db.cart.update({
            id: user.cart.id,
            user: {
                id: user.id,
                email: user.email
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
            code: "SUCCESSFULLY_UPDATED_CART",
            success: true,
            message: `You have successfully updated cart entry: ${args.id}`,
            cart: cart
        }
        return result
    } catch (error) {
        return new ApolloError(`Could not update quantity of entry with ID: ${args.id} to ${args.quantity} because of error: ${error}`, 'DATABASE_COULD_NOT_UPDATE')
    }
}

function purchaseCart(context) {
    try {
        if (!context.user) {
            return new AuthenticationError('User has not logged in')
        }
        var user = db.users.get(context.user.sub)
        db.cart.update({
            id: user.cart.id,
            user: {
                id: user.id,
                email: user.email
            },
            cartItems: [],
            total: 0.00
        })
        var cart = db.cart.get(user.cart.id)
        db.users.update({
            id: user.id,
            email: user.email,
            password: user.password,
            cart: cart
        })
        var result = {
            code: "SUCCESSFULLY_PURCHASED_CART",
            success: true,
            message: `You have successfully purchased the items in your cart`,
            cart: cart
        }
        return result
    } catch (error) {
        return new ApolloError(`Could not purchase items placed in your cart because of error: ${error}`, 'DATABASE_COULD_NOT_PURCHASE')
    }
}

function deleteUser(context) {
    try {
        if (!context.user) {
            return new AuthenticationError('User has not logged in')
        }
        var user = db.users.get(context.user.sub)
        db.users.delete(user.id)
        if (user.cart) {
            var usersCartId = user.cart.id
            db.cart.delete(usersCartId)
        }
        var result = {
            code: 'SUCCESSFULLY_DELETED_USER',
            success: true,
            message: 'You have successfully deleted your account',
            user: null
        }
        return result
    } catch (error) {
        return new ApolloError(`Could not delete user because of error: ${error}`, 'DATABASE_COULD_NOT_DELETE_USER')
    }
}

const MutationResponse = {
    __resolveType(mutationResponse, context, info) {
        return null
    }
}

module.exports = { Query, Mutation, MutationResponse }