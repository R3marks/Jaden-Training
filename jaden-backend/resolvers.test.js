const { isDescribable } = require('graphql-tools')
const resolvers = require('./resolvers')
const db = require('./db')
const AuthUtils = require('./auth')

jest.mock('./db')
jest.mock('./auth')

describe('tour', () => {

    test('Should return an individual tour', () => {
        const args = { id: '1' }
        const mockReturn = {
            id: '1',
            date: "MAY 26",
            city: "SAN DIEGO, CA",
            link: "https://goo.gl/maps/jDKwrSR9XokpJpEr6",
            arena: "PECHANGA ARENA"
        }
        db.tours.get.mockReturnValue(mockReturn)
        const result = resolvers.Query.tour(null, args)
        expect(result).toBe(mockReturn)
    })

    test('Should not find an individual tour', () => {
        const args = { id: '1' }
        db.tours.get.mockReturnValue(null)
        const result = resolvers.Query.tour(null, args)
        expect(result.message).toBe('Could not find Tour with ID: 1')
    })

    test('Should cause an error', () => {
        const args = { id: '1' }
        db.tours.get.mockImplementation(() => {
            throw new Error()
        })
        const result = resolvers.Query.tour(null, args)
        expect(result.message).toBe('Could not get tour by ID in database')
    })

})

describe('tours', () => {

    test('Should return a list of tours', () => {
        const mockReturn = [{
            id: '1',
            date: "MAY 26",
            city: "SAN DIEGO, CA",
            link: "https://goo.gl/maps/jDKwrSR9XokpJpEr6",
            arena: "PECHANGA ARENA"
        }]
        db.tours.list.mockReturnValue(mockReturn)
        const result = resolvers.Query.tours()
        expect(result).toBe(mockReturn)
    })

    test('Should not find a list of tours', () => {
        db.tours.list.mockReturnValue(null)
        const result = resolvers.Query.tours()
        expect(result.message).toBe('Could not find all Tours')
    })

    test('Should cause an error', () => {
        db.tours.list.mockImplementation(() => {
            throw new Error()
        })
        const result = resolvers.Query.tours()
        expect(result.message).toBe('Could not get all tours from database')
    })

})

describe('searchTour', () => {

    test('Should be able to search by date', () => {
        const args = { search: 'MAY 26'}
        const mockReturn = [{
            id: '1',
            date: "MAY 26",
            city: "SAN DIEGO, CA",
            link: "https://goo.gl/maps/jDKwrSR9XokpJpEr6",
            arena: "PECHANGA ARENA"
        }, {
            id: "2",
            date: "JUN 19",
            city: "MINNEAPOLIS, MN",
            link: "https://g.page/TargetCenterMN?share",
            arena: "TARGET CENTER"
        }]
        // Result returns a Set, but GraphQL sends it as an array
        var expectedResult = new Set([mockReturn[0]])
        db.tours.list.mockReturnValue(mockReturn)
        const result = resolvers.Query.searchTour(null, args)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should be able to search by city', () => {
        const args = { search: 'SAN DIEGO'}
        const mockReturn = [{
            id: '1',
            date: "MAY 26",
            city: "SAN DIEGO, CA",
            link: "https://goo.gl/maps/jDKwrSR9XokpJpEr6",
            arena: "PECHANGA ARENA"
        }, {
            id: "2",
            date: "JUN 19",
            city: "MINNEAPOLIS, MN",
            link: "https://g.page/TargetCenterMN?share",
            arena: "TARGET CENTER"
        }]
        var expectedResult = new Set([mockReturn[0]])
        db.tours.list.mockReturnValue(mockReturn)
        const result = resolvers.Query.searchTour(null, args)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should be able to search by arena', () => {
        const args = { search: 'PECHANGA'}
        const mockReturn = [{
            id: '1',
            date: "MAY 26",
            city: "SAN DIEGO, CA",
            link: "https://goo.gl/maps/jDKwrSR9XokpJpEr6",
            arena: "PECHANGA ARENA"
        }, {
            id: "2",
            date: "JUN 19",
            city: "MINNEAPOLIS, MN",
            link: "https://g.page/TargetCenterMN?share",
            arena: "TARGET CENTER"
        }]
        var expectedResult = new Set([mockReturn[0]])
        db.tours.list.mockReturnValue(mockReturn)
        const result = resolvers.Query.searchTour(null, args)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should NOT be able to search by link', () => {
        const args = { search: 'maps'}
        const mockReturn = [{
            id: '1',
            date: "MAY 26",
            city: "SAN DIEGO, CA",
            link: "https://goo.gl/maps/jDKwrSR9XokpJpEr6",
            arena: "PECHANGA ARENA"
        }, {
            id: "2",
            date: "JUN 19",
            city: "MINNEAPOLIS, MN",
            link: "https://g.page/TargetCenterMN?share",
            arena: "TARGET CENTER"
        }]
        db.tours.list.mockReturnValue(mockReturn)
        const result = resolvers.Query.searchTour(null, args)
        expect(result).toStrictEqual(new Set)
    })

    test('Should return multiple results based off search', () => {
        const args = { search: 'M'}
        const mockReturn = [{
            id: '1',
            date: "MAY 26",
            city: "SAN DIEGO, CA",
            link: "https://goo.gl/maps/jDKwrSR9XokpJpEr6",
            arena: "PECHANGA ARENA"
        }, {
            id: "2",
            date: "JUN 19",
            city: "MINNEAPOLIS, MN",
            link: "https://g.page/TargetCenterMN?share",
            arena: "TARGET CENTER"
        }]
        var expectedResult = new Set(mockReturn)
        db.tours.list.mockReturnValue(mockReturn)
        const result = resolvers.Query.searchTour(null, args)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should return all tours with an empty search term', () => {
        const args = { search: ''}
        const mockReturn = [{
            id: '1',
            date: "MAY 26",
            city: "SAN DIEGO, CA",
            link: "https://goo.gl/maps/jDKwrSR9XokpJpEr6",
            arena: "PECHANGA ARENA"
        }, {
            id: "2",
            date: "JUN 19",
            city: "MINNEAPOLIS, MN",
            link: "https://g.page/TargetCenterMN?share",
            arena: "TARGET CENTER"
        }]
        var expectedResult = new Set(mockReturn)
        db.tours.list.mockReturnValue(mockReturn)
        const result = resolvers.Query.searchTour(null, args)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should return no tours based off search', () => {
        const args = { search: 'Z'}
        const mockReturn = [{
            id: '1',
            date: "MAY 26",
            city: "SAN DIEGO, CA",
            link: "https://goo.gl/maps/jDKwrSR9XokpJpEr6",
            arena: "PECHANGA ARENA"
        }, {
            id: "2",
            date: "JUN 19",
            city: "MINNEAPOLIS, MN",
            link: "https://g.page/TargetCenterMN?share",
            arena: "TARGET CENTER"
        }]
        db.tours.list.mockReturnValue(mockReturn)
        const result = resolvers.Query.searchTour(null, args)
        expect(result).toStrictEqual(new Set)
    })

    test('Should cause an error', () => {
        const args = { search: 'MAY 26'}
        db.tours.list.mockImplementation(() => {
            throw new Error()
        })
        const result = resolvers.Query.searchTour(null, args)
        expect(result.message).toBe('Could not search through database for tours')
    })

})

describe('allMerch', () => {

    test('Should return a list of merch', () => {
        const mockReturn = [{
            id: "1",
            src: "/Images - Jaden/ctv3_tshirt.png",
            name: "CTV3 T-SHIRT",
            price: 19.99
        }]
        db.tours.list.mockReturnValue(mockReturn)
        const result = resolvers.Query.allMerch()
        expect(result).toBe(mockReturn)
    })

    test('Should not find a list of merch', () => {
        db.tours.list.mockReturnValue(null)
        const result = resolvers.Query.allMerch()
        expect(result.message).toBe('Could not find all Merch')
    })

    test('Should cause an error', () => {
        db.tours.list.mockImplementation(() => {
            throw new Error()
        })
        const result = resolvers.Query.allMerch()
        expect(result.message).toBe('Could not get all Merch from database')
    })

})

describe('allCart', () => {

    test('Should return user\'s cart', () => {
        const context = { user: { sub: 'test' }}
        const mockReturn = {
            cart: {
                id: "Sk7yBBYbO",
                user: {
                    id: "r1aGMSt-u",
                    email: "t@t.com"
                },
                cartItems: [{
                    id: "1",
                    src: "/Images - Jaden/ctv3_tshirt.png",
                    name: "CTV3 T-SHIRT",
                    price: 19.99,
                    quantity: 2
                }],
                total: 39.98
            }
        }
        db.users.get.mockReturnValue(mockReturn)
        const result = resolvers.Query.allCart(null, null, context)
        expect(result).toBe(mockReturn.cart)
    })

    test('Should return user\'s empty cart', () => {
        const context = { user: { sub: 'test' }}
        const mockReturn = {
            id: '1',
            email: 'test@test.com',
            cart: null
        }
        const expectedResult = {
            user: {
                id: '1',
                email: 'test@test.com'
            },
            cartItems: [],
            total: 0.00
        }
        db.users.get.mockReturnValue(mockReturn)
        const result = resolvers.Query.allCart(null, null, context)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should not find a list of merch', () => {
        const context = { user: null }
        const result = resolvers.Query.allCart(null, null, context)
        expect(result.message).toBe('User has not logged in')
    })

    test('Should cause an error', () => {
        const context = { user: { sub: 'test' }}
        db.users.get.mockImplementation(() => {
            throw new Error()
        })
        const result = resolvers.Query.allCart(null, null, context)
        expect(result.message).toBe('Could not retrieve cart from database due to Error')
    })

})

describe('userInfo', () => {

    test('Should return user\'s info', () => {
        const context = { 
            user: { 
                sub: 'test',
                email: 'test@test.com'
            }}
        const mockReturn = {
            cart: {
                total: 39.98
            }
        }
        const expectedResult = {
            code: 'AUTHENTICATED',
            success: true,
            message: 'User has an authenticated token stored locally within cookies',
            user: { 
                id: 'test',
                email: 'test@test.com',
                cart: {
                    total: 39.98
                }
            }
        }
        db.users.get.mockReturnValue(mockReturn)
        const result = resolvers.Mutation.userInfo(null, null, context)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should return user\'s info with an empty cart', () => {
        const context = { 
            user: { 
                sub: 'test',
                email: 'test@test.com'
            }}
        const mockReturn = {
            cart: null
        }
        const expectedResult = {
            code: 'AUTHENTICATED',
            success: true,
            message: 'User has an authenticated token stored locally within cookies',
            user: { 
                id: 'test',
                email: 'test@test.com',
                cart: {
                    total: 0.00
                }
            }
        }
        db.users.get.mockReturnValue(mockReturn)
        const result = resolvers.Mutation.userInfo(null, null, context)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should not return user\'s info', () => {
        const context = { user: null }
        const expectedResult = {         
            code: 'UNAUTHENTICATED',
            success: false,
            message: 'User has no authenticated token stored locally within cookies',
            user: null
        }
        const result = resolvers.Mutation.userInfo(null, null, context)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should cause an error', () => {
        const context = { user: { sub: 'test' }}
        db.users.get.mockImplementation(() => {
            throw new Error()
        })
        const result = resolvers.Mutation.userInfo(null, null, context)
        expect(result.message).toBe('Could not retrieve user\'s info')
    })

})

describe('signUp', () => {

    test('Should sign user up', () => {
        const context = { res: {} }
        context.res.cookie = jest.fn().mockReturnValue(context.res)
        const args = {
            credentials: {
                email: 'test@test.com',
                password: 'password'
            }
        }
        const mockReturnListOfUsers = [{ email: 'testing@test.com' }]
        const mockReturnNewUser = { id: '1', email: 'test@test.com' }
        const expectedResult = {
            code: "SUCCESSFUL_SIGN_UP",
            success: true,
            message: `User with email: test@test.com successfully signed up`,
            user: {
                id: '1',
                email: 'test@test.com'
            }
        }
        db.users.list.mockReturnValue(mockReturnListOfUsers)
        AuthUtils.hashPassword.mockReturnValue('hashedPassword')
        db.users.create.mockReturnValue('1')
        db.users.get.mockReturnValue(mockReturnNewUser)
        AuthUtils.createToken.mockReturnValue('token')
        const result = resolvers.Mutation.signUp(null, args, context)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should not be able to sign user up as email is already registered', () => {
        const args = {
            credentials: {
                email: 'test@test.com',
                password: 'password'
            }
        }
        const mockReturnListOfUsers = [{ email: 'test@test.com' }]
        db.users.list.mockReturnValue(mockReturnListOfUsers)
        const result = resolvers.Mutation.signUp(null, args, null)
        expect(result.message).toBe('Email already registered')
    })

    test('Should cause an error', () => {
        db.users.list.mockImplementation(() => {
            throw new Error()
        })
        const result = resolvers.Mutation.signUp(null, null, null)
        expect(result.message).toBe('Could not create new user due to: Error')
    })

})

describe('signIn', () => {

    test('Should sign user in', () => {
        const context = { res: {} }
        context.res.cookie = jest.fn().mockReturnValue(context.res)
        const args = {
            credentials: {
                email: 'test@test.com',
                password: 'password'
            }
        }
        const mockReturnListOfUsers = [{
            id: '1',
            email: 'test@test.com',
            password: 'password'
        }]
        const expectedResult = {
            code: "SUCCESSFUL_SIGN_IN",
            success: true,
            message: `User with email: test@test.com successfully signed in`,
            user: {
                id: '1',
                email: 'test@test.com'
            }
        }
        db.users.list.mockReturnValue(mockReturnListOfUsers)
        AuthUtils.verifyPassword.mockReturnValue(true)
        AuthUtils.createToken.mockReturnValue('token')
        const result = resolvers.Mutation.signIn(null, args, context)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should not be able to sign user in as email is not registered', () => {
        const args = {
            credentials: {
                email: 'test@test.com',
                password: 'password'
            }
        }
        const mockReturnListOfUsers = [{ email: 'testing@test.com' }]
        db.users.list.mockReturnValue(mockReturnListOfUsers)
        const result = resolvers.Mutation.signIn(null, args, null)
        expect(result.message).toBe('Email not registered')
    })

    test('Should not be able to sign user in because of incorrect password', () => {
        const args = {
            credentials: {
                email: 'test@test.com',
                password: 'password'
            }
        }
        const mockReturnListOfUsers = [{ email: 'test@test.com' }]
        db.users.list.mockReturnValue(mockReturnListOfUsers)
        AuthUtils.verifyPassword.mockReturnValue(false)
        const result = resolvers.Mutation.signIn(null, args, null)
        expect(result.message).toBe('Password incorrect')
    })

    test('Should cause an error', () => {
        db.users.list.mockImplementation(() => {
            throw new Error()
        })
        const result = resolvers.Mutation.signIn(null, null, null)
        expect(result.message).toBe('Could not sign user in because: Error')
    })

})

describe('signOut', () => {

    test('Should sign user out', () => {
        const context = { res: {} }
        context.res.clearCookie = jest.fn().mockReturnValue(context.res)
        const result = resolvers.Mutation.signOut(null, null, context)
        expect(result).toStrictEqual({ user: undefined })
    })

})

describe('addToCart', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should add to cart', () => {
        const context = { user: { sub: '1' }}
        const args = { id: '11' }
        const mockReturnUser = {
            id: '1',
            email: 'test@test.com',
            cart: {
                id: '21',
                user: {
                    id: '1',
                    email: 'test@test.com'
                },
                cartItems: [{
                    id: "12",
                    src: "merch.jpg",
                    name: "TEST MERCH",
                    price: 19.99,
                    quantity: 1
                }],
                total: 19.99
            }
        }
        const mockReturnMerch = {
            id: "11",
            src: "merch2.jpg",
            name: "TEST MERCH 2",
            price: 9.99,
        }
        const mockReturnCart = {
            id: '21',
            user: {
                id: '1',
                email: 'test@test.com'
            },
            cartItems: [{
                id: "11",
                src: "merch2.jpg",
                name: "TEST MERCH 2",
                price: 9.99,
                quantity: 1
            }, {
                id: "12",
                src: "merch.jpg",
                name: "TEST MERCH",
                price: 19.99,
                quantity: 1
            }],
            total: 29.98
        }
        const expectedResult = {
            code: "SUCCESSFULLY_ADDED_TO_CART",
            success: true,
            message: `You have successfully added TEST MERCH 2 to the cart`,
            cart: mockReturnCart
        }
        db.users.get.mockReturnValueOnce(mockReturnUser)
        db.merch.get.mockReturnValueOnce(mockReturnMerch)
        db.cart.update.mockReturnValue(null)
        db.cart.get.mockReturnValueOnce(mockReturnCart)
        const result = resolvers.Mutation.addToCart(null, args, context)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should add to an empty cart', () => {
        const context = { user: { sub: '1' }}
        const args = { id: '11' }
        const mockReturnUser = {
            id: '1',
            email: 'test@test.com',
            cart: null
        }
        const mockReturnCartId = '21'
        const mockReturnNewCart = {
            user: { 
                id: '1',
                email: 'test@test.com'
            }, 
            cartItems: [],
            total: 0.00 
        }
        const mockReturnMerch = {
            id: "11",
            src: "merch2.jpg",
            name: "TEST MERCH 2",
            price: 9.99,
        }
        const mockReturnCart = {
            id: '21',
            user: {
                id: '1',
                email: 'test@test.com'
            },
            cartItems: [{
                id: "11",
                src: "merch2.jpg",
                name: "TEST MERCH 2",
                price: 9.99,
                quantity: 1
            }],
            total: 9.99
        }
        const expectedResult = {
            code: "SUCCESSFULLY_ADDED_TO_CART",
            success: true,
            message: `You have successfully added TEST MERCH 2 to the cart`,
            cart: mockReturnCart
        }
        db.users.get.mockReturnValueOnce(mockReturnUser)
        db.cart.create.mockReturnValueOnce(mockReturnCartId)
        db.cart.get.mockReturnValueOnce(mockReturnNewCart)
        db.users.update.mockReturnValueOnce(null)
        db.merch.get.mockReturnValueOnce(mockReturnMerch)
        db.cart.update.mockReturnValue(null)
        db.cart.get.mockReturnValueOnce(mockReturnCart)
        const result = resolvers.Mutation.addToCart(null, args, context)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should update quantity of existing merch in cart', () => {
        const context = { user: { sub: '1' }}
        const args = { id: '11' }
        const mockReturnUser = {
            id: '1',
            email: 'test@test.com',
            cart: {
                id: '21',
                user: {
                    id: '1',
                    email: 'test@test.com'
                },
                cartItems: [{
                    id: "11",
                    src: "merch2.jpg",
                    name: "TEST MERCH 2",
                    price: 19.99,
                    quantity: 1
                }],
                total: 19.99
            }
        }
        const mockReturnMerch = {
            id: "11",
            src: "merch2.jpg",
            name: "TEST MERCH 2",
            price: 9.99,
        }
        const mockReturnCart = {
            id: '21',
            user: {
                id: '1',
                email: 'test@test.com'
            },
            cartItems: [{
                id: "11",
                src: "merch2.jpg",
                name: "TEST MERCH 2",
                price: 9.99,
                quantity: 2
            }],
            total: 39.98
        }
        const expectedResult = {
            code: "SUCCESSFULLY_ADDED_TO_CART",
            success: true,
            message: `You have successfully added TEST MERCH 2 to the cart`,
            cart: mockReturnCart
        }
        db.users.get.mockReturnValueOnce(mockReturnUser)
        db.merch.get.mockReturnValueOnce(mockReturnMerch)
        db.cart.update.mockReturnValue(null)
        db.cart.get.mockReturnValueOnce(mockReturnCart)
        const result = resolvers.Mutation.addToCart(null, args, context)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should return an authentication error if user is not logged in when adding to cart', () => {
        const context = { user: null }
        const result = resolvers.Mutation.addToCart(null, null, context)
        expect(result.message).toBe('User has not logged in')
    })
    
    test('Should cause an error', () => {
        const context = { user: { sub: '1' }}
        db.users.get.mockImplementation(() => {
            throw new Error()
        })
        const result = resolvers.Mutation.addToCart(null, null, context)
        expect(result.message).toBe('Could not add to cart because of an error: Error')
    })

})

describe('removeFromCart', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should remove from cart', () => {
        const context = { user: { sub: '1' }}
        const args = { id: '11' }
        const mockReturnUser = {
            id: '1',
            email: 'test@test.com',
            cart: {
                id: '21',
                user: {
                    id: '1',
                    email: 'test@test.com'
                },
                cartItems: [{
                    id: "11",
                    src: "merch.jpg",
                    name: "TEST MERCH",
                    price: 19.99,
                    quantity: 1
                }, {
                    id: "12",
                    src: "merch2.jpg",
                    name: "TEST MERCH 2",
                    price: 9.99,
                    quantity: 1
                }],
                total: 29.98
            }
        }
        const mockReturnCart = {
            id: '21',
            user: {
                id: '1',
                email: 'test@test.com'
            },
            cartItems: [{
                id: "12",
                src: "merch.jpg",
                name: "TEST MERCH",
                price: 19.99,
                quantity: 1
            }],
            total: 19.99
        }
        const expectedResult = {
            code: 'SUCCESSFULLY_REMOVED_FROM_CART',
            success: true,
            message: `You have successfully deleted the cart entry: 11`,
            cart: mockReturnCart
        }
        db.users.get.mockReturnValueOnce(mockReturnUser)
        db.cart.update.mockReturnValue(null)
        db.cart.get.mockReturnValueOnce(mockReturnCart)
        db.users.update.mockReturnValue(null)
        const result = resolvers.Mutation.removeFromCart(null, args, context)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should remove from cart to produce an empty cart', () => {
        const context = { user: { sub: '1' }}
        const args = { id: '11' }
        const mockReturnUser = {
            id: '1',
            email: 'test@test.com',
            cart: {
                id: '21',
                user: {
                    id: '1',
                    email: 'test@test.com'
                },
                cartItems: [{
                    id: "11",
                    src: "merch.jpg",
                    name: "TEST MERCH",
                    price: 19.99,
                    quantity: 1
                }],
                total: 19.99
            }
        }
        const mockReturnCart = {
            id: '21',
            user: {
                id: '1',
                email: 'test@test.com'
            },
            cartItems: [],
            total: 0.00
        }
        const expectedResult = {
            code: 'SUCCESSFULLY_REMOVED_FROM_CART',
            success: true,
            message: `You have successfully deleted the cart entry: 11`,
            cart: mockReturnCart
        }
        db.users.get.mockReturnValueOnce(mockReturnUser)
        db.cart.update.mockReturnValue(null)
        db.cart.get.mockReturnValueOnce(mockReturnCart)
        db.users.update.mockReturnValue(null)
        const result = resolvers.Mutation.removeFromCart(null, args, context)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should return an authentication error if user is not logged in when removing from cart', () => {
        const context = { user: null }
        const result = resolvers.Mutation.removeFromCart(null, null, context)
        expect(result.message).toBe('User has not logged in')
    })
    
    test('Should cause an error', () => {
        const context = { user: { sub: '1' }}
        const args = { id: '11' }
        db.users.get.mockImplementation(() => {
            throw new Error()
        })
        const result = resolvers.Mutation.removeFromCart(null, args, context)
        expect(result.message).toBe('Could not delete entry with ID: 11 because of error: Error')
    })

})

describe('updateCart', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should update cart', () => {
        const context = { user: { sub: '1' }}
        const args = { id: '11', quantity: 2 }
        const mockReturnUser = {
            id: '1',
            email: 'test@test.com',
            cart: {
                id: '21',
                user: {
                    id: '1',
                    email: 'test@test.com'
                },
                cartItems: [{
                    id: "11",
                    src: "merch.jpg",
                    name: "TEST MERCH",
                    price: 19.99,
                    quantity: 1
                }],
                total: 19.99
            }
        }
        const mockReturnCart = {
            id: '21',
            user: {
                id: '1',
                email: 'test@test.com'
            },
            cartItems: [{
                id: "11",
                src: "merch.jpg",
                name: "TEST MERCH",
                price: 19.99,
                quantity: 2
            }],
            total: 39.98
        }
        const expectedResult = {
            code: "SUCCESSFULLY_UPDATED_CART",
            success: true,
            message: `You have successfully updated cart entry: 11`,
            cart: mockReturnCart
        }
        db.users.get.mockReturnValueOnce(mockReturnUser)
        db.cart.update.mockReturnValue(null)
        db.cart.get.mockReturnValueOnce(mockReturnCart)
        db.users.update.mockReturnValue(null)
        const result = resolvers.Mutation.updateCart(null, args, context)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should return an authentication error if user is not logged in when updating cart', () => {
        const context = { user: null }
        const result = resolvers.Mutation.updateCart(null, null, context)
        expect(result.message).toBe('User has not logged in')
    })
    
    test('Should cause an error', () => {
        const context = { user: { sub: '1' }}
        const args = { id: '11', quantity: 2 }
        db.users.get.mockImplementation(() => {
            throw new Error()
        })
        const result = resolvers.Mutation.updateCart(null, args, context)
        expect(result.message).toBe('Could not update quantity of entry with ID: 11 to 2 because of error: Error')
    })

})

describe('purchaseCart', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should update cart', () => {
        const context = { user: { sub: '1' }}
        const mockReturnUser = {
            id: '1',
            email: 'test@test.com',
            cart: {
                id: '21',
                user: {
                    id: '1',
                    email: 'test@test.com'
                },
                cartItems: [{
                    id: "11",
                    src: "merch.jpg",
                    name: "TEST MERCH",
                    price: 19.99,
                    quantity: 1
                }],
                total: 19.99
            }
        }
        const mockReturnCart = {
            id: '21',
            user: {
                id: '1',
                email: 'test@test.com'
            },
            cartItems: [],
            total: 0.00
        }
        const expectedResult = {
            code: "SUCCESSFULLY_PURCHASED_CART",
            success: true,
            message: `You have successfully purchased the items in your cart`,
            cart: mockReturnCart
        }
        db.users.get.mockReturnValueOnce(mockReturnUser)
        db.cart.update.mockReturnValue(null)
        db.cart.get.mockReturnValueOnce(mockReturnCart)
        db.users.update.mockReturnValue(null)
        const result = resolvers.Mutation.purchaseCart(null, null, context)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should return an authentication error if user is not logged in when purchasing cart', () => {
        const context = { user: null }
        const result = resolvers.Mutation.purchaseCart(null, null, context)
        expect(result.message).toBe('User has not logged in')
    })
    
    test('Should cause an error', () => {
        const context = { user: { sub: '1' }}
        db.users.get.mockImplementation(() => {
            throw new Error()
        })
        const result = resolvers.Mutation.purchaseCart(null, null, context)
        expect(result.message).toBe('Could not purchase items placed in your cart because of error: Error')
    })

})

describe('deleteUser', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should delete user', () => {
        const context = { user: { sub: '1' }}
        const mockReturnUser = {
            id: '1',
            email: 'test@test.com',
            cart: {
                id: '21',
                user: {
                    id: '1',
                    email: 'test@test.com'
                },
                cartItems: [{
                    id: "11",
                    src: "merch.jpg",
                    name: "TEST MERCH",
                    price: 19.99,
                    quantity: 1
                }],
                total: 19.99
            }
        }
        const expectedResult = {
            code: 'SUCCESSFULLY_DELETED_USER',
            success: true,
            message: 'You have successfully deleted your account',
            user: null
        }
        db.users.get.mockReturnValueOnce(mockReturnUser)
        db.users.delete.mockReturnValue(null)
        db.cart.delete.mockReturnValue(null)
        const result = resolvers.Mutation.deleteUser(null, null, context)
        expect(result).toStrictEqual(expectedResult)
    })

    test('Should return an authentication error if user is not logged in when deleting profile', () => {
        const context = { user: null }
        const result = resolvers.Mutation.deleteUser(null, null, context)
        expect(result.message).toBe('User has not logged in')
    })
    
    test('Should cause an error', () => {
        const context = { user: { sub: '1' }}
        db.users.get.mockImplementation(() => {
            throw new Error()
        })
        const result = resolvers.Mutation.deleteUser(null, null, context)
        expect(result.message).toBe('Could not delete user because of error: Error')
    })

})
