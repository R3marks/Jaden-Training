const { ApolloError } = require('apollo-server')
const db = require('./db')
const AuthUtils = require('./auth')

const Query = {
    tour: (parent, args) => getTourByID(parent, args),
    tours: () => getAllTours(),
    searchTour: (parent, args) => searchTours(parent, args),
    allMerch: () => getAllMerch(),
    allCart: () => getAllCart()
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

function getAllCart() {
    try {
        var result = db.cart.list()
        if (!result) {
            return new ApolloError('Could not find all Tours', 'DATABASE_TABLE_NOT_FOUND')
        }
        return result
    } catch (error) {
        return new ApolloError('Could not get all tours from database', 'DATABASE_ERROR')
    }
}

const Mutation = {
    signUp: (parent, args) => signUp(args),
    signIn: (parent, args) => signIn(args),
    addToCart: (parent, args) => addMerchToCart(args),
    deleteCartItemById: (parent, args) => deleteCartEntryById(args),
    updateCartItemQuantityById: (parent, args) => updateCartEntryQuantityById(args),
    purchaseCart: () => purchaseCart()
}

function signUp(args) {
    try {
        var users = db.users.list() // check email does not exist
        users.map(user => {
            if (user.email === args.credentials.email) {
                throw new ApolloError ('Email already in use', 'DATABASE_EMAIL_ALREADY_EXISTS')
            }
        })
        var hash = AuthUtils.hashPassword(args.credentials.password)
        var user = db.users.create({ email: args.credentials.email, password: hash })
        var token = AuthUtils.createToken(user)
        console.log(token)
        return {
            token,
            user: {
                id: user,
                email: args.credentials.email
            }
        }
    } catch (error) {
        return new ApolloError(`Could not create new user due to: ${error}`, 'DATABASE_COULD_NOT_SIGN_UP')
    }
}

function signIn(args) {
    try {
        let existingUser
        var users = db.users.list() // check email exists
        users.forEach(user => {
            if (user.email === args.credentials.email) {
                existingUser = user
                return 
            }
        })
        if (!existingUser) {
            return new ApolloError('Incorrect email address', 'DATABASE_COULD_NOT_FIND_EMAIL')
        }
        var isValidPassword = AuthUtils.verifyPassword(args.credentials.password, existingUser.password)
        if (!isValidPassword) {
            return new ApolloError('Incorrect password', 'DATABASE_PASSWORD_DOES_NOT_MATCH_EMAIL')
        }
        var token = AuthUtils.createToken(existingUser)
        return {
            token,
            user: {
                id: existingUser.id,
                email: existingUser.email
            }
        }
    } catch (error) {
        return new ApolloError(`Could not sign user in because: ${error}`, 'DATABASE_COULD_NOT_SIGN_IN')
    }
}

function addMerchToCart(args) {
    try {
        var merchById = db.merch.get(args.id)
        var id = db.cart.create({ src: merchById.src, name: merchById.name, price: merchById.price, quantity: 1 })
        var cart = db.cart.list()
        var result = {
            code: "200",
            success: true,
            message: `You have successfully added ${merchById.name} to the cart with ID: ${id}`,
            cart: cart
        }
        return result
    } catch (error) {
        return new ApolloError('Could not create a new entry in cart', 'DATABASE_COULD_NOT_CREATE')
    }
}

function deleteCartEntryById(args) {
    try {
        db.cart.delete(args.id)
        var cart = db.cart.list()
        var result = {
            code: "200",
            success: true,
            message: `You have successfully deleted the cart entry: ${args.id}`,
            cart: cart
        }
        return result
    } catch (error) {
        return new ApolloError(`Could not delete entry with ID: ${args.id}`, 'DATABASE_COULD_NOT_DELETE')
    }
}

function updateCartEntryQuantityById(args) {
    try {
        var cartEntry = db.cart.get(args.id)
        db.cart.update({ id: args.id, src: cartEntry.src, name: cartEntry.name, price: cartEntry.price, quantity: args.quantity })
        var cart = db.cart.list()
        var result = {
            code: "200",
            success: true,
            message: `You have successfully changed the quantity of: ${args.id}, to ${args.quantity}`,
            cart: cart
        }
        return result
    } catch (error) {
        return new ApolloError(`Could not update quantity of entry with ID: ${args.id} to ${args.quantity}`, 'DATABASE_COULD_NOT_UPDATE')
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