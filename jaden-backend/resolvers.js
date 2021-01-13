const db = require('./db')

const Query = {
    tour: (parent, args) => db.tours.get(args.id),
    tours: () => db.tours.list(),
    searchTour: (parent, args) => searchTours(parent, args)// (parent, args) => db.tours.list().length
}

function searchTours(parent, args) {
    console.log(parent)
    console.log(args)
    let results = new Set

    db.tours.list().forEach(tour => {
        for (key in tour) {
            if (tour[key].indexOf(args.search) != -1 && key !== "link") {
                results.add(tour)
            }
        }
    })
    console.log(results)
    return results
}


module.exports = { Query }