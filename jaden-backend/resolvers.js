const db = require('./db')

const Query = {
    tour: (parent, args) => db.tours.get(args.id),
    tours: () => db.tours.list()
}

console.log(db.tours.get({id: "1"})) //? (Does work tho)

module.exports = { Query }