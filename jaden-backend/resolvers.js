const { ApolloError } = require('apollo-server')
const db = require('./db')

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
    addToCart: (parent, args) => addMerchToCart(args),
    deleteCartItemById: (parent, args) => deleteCartEntryById(args),
    updateCartItemQuantityById: (parent, args) => updateCartEntryQuantityById(args)
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

const MutationResponse = {
    __resolveType(mutationResponse, context, info) {
        return null
    }
}

module.exports = { Query, Mutation, MutationResponse }