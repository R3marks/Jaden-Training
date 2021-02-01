const { DataStore } = require('notarealdb')

const db = new DataStore('./data')

module.exports = {
    users: db.collection('users'),
    tours: db.collection('tours'),
    merch: db.collection('merch'),
    cart: db.collection('cart')
}
