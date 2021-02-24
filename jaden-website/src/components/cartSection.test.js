import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import UserEvent from '@testing-library/user-event'
import { GET_CART } from '../graphql/Queries'
import { REMOVE_FROM_CART, UPDATE_QUANTITY, PURCHASE_CART } from '../graphql/Mutations'
import { MockedProvider } from '@apollo/client/testing'
import CartSection from './CartSection'
import { BrowserRouter } from 'react-router-dom'
import { GraphQLError } from 'graphql'

describe('<CartSection />', () => {
    test('Should initially display loading', () => {
        const mocks = [{
                request: {
                    query: GET_CART
                },
                result: {
                    data: {
                        allCart: [{
                            user: {
                                id: '1',
                                email: 'test@test.com'
                            },
                            cartItems: [{
                                id: '1',
                                src: 'merch.jpg',
                                name: 'TEST MERCH',
                                price: 99.99,
                                quantity: 3
                            }],
                            total: 299.97
                        }]
                    }
                }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <CartSection />
            </MockedProvider>
        )
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
    })

    test('Should display an empty cart if provided', async () => {
        const mocks = [{
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: null
                }
            }
        }]
        const { container } = render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <CartSection />
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument()
        })
    })

    test('Should display returned data from query', async () => {
        const mocks = [{
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '1',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 3
                        }],
                        total: 299.97
                    }
                }
            }
        }]
        const { container } = render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <CartSection />
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByAltText('Cart')).toHaveAttribute('src', 'merch.jpg')
            expect(screen.getByText(/TEST MERCH/i)).toBeInTheDocument()
            expect(container.querySelector('[data-key="1"]'))
            expect(screen.getByDisplayValue(/3/i)).toBeInTheDocument()
            expect(screen.getAllByText(/£299.97/i))
        })
    })

    test('Should produce a known network error when fetching cart', async () => {
        const mocks = [{
                request: {
                    query: GET_CART
                },
                error: new Error('Failed to fetch')
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <CartSection />
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText(/Server Offline/i)).toBeInTheDocument()
        })
    })

    test('Should produce an unknown network error when fetching cart', async () => {
        const mocks = [{
                request: {
                    query: GET_CART
                },
                error: 'Displaying Network Error'
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <CartSection />
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('Network Error'))
        await waitFor(() => {
            expect(screen.getByText(/Displaying Network Error/)).toBeInTheDocument()
        })
    })

    test('Should produce an unknown GraphQL error when fetching cart', async () => {
        const mocks = [{
                request: {
                    query: GET_CART
                },
                result: {
                    errors: [new GraphQLError('Displaying GraphQL Error')]
                }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <CartSection />
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
            expect(screen.getByText(/Displaying GraphQL Error/)).toBeInTheDocument()
        })
    })

    test('Should remove single item from cart, and leave an empty cart', async () => {
        let mutationCalled = false
        const mocks = [{
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 3
                        }],
                        total: 299.97
                    }
                }
            }
        }, {
            request: {
                query: REMOVE_FROM_CART,
                variables: {
                    idProvided: '11'
                }
            },
            result: () => {
                mutationCalled = true
                return {
                    data: {
                        removeFromCart: {
                            cartItems: [],
                            total: 0.00
                        }
                    }
                }
            }
        }, { 
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [],
                        total: 0.00
                    }
                }
            }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <CartSection />
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText(/TEST MERCH/i)).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('removeFromCart-11'))
        await waitFor(() => {
            expect(mutationCalled).toBe(true)
            expect(screen.getByText(/Your cart is empty/i))
        })
    })

    test('Should remove single item from cart', async () => {
        let mutationCalled = false
        const mocks = [{
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 3
                        },{
                            id: '12',
                            src: 'merch2.jpg',
                            name: 'TEST MERCH 2',
                            price: 0.03,
                            quantity: 1
                        }],
                        total: 300.00
                    }
                }
            }
        }, {
            request: {
                query: REMOVE_FROM_CART,
                variables: {
                    idProvided: '12'
                }
            },
            result: () => {
                mutationCalled = true
                return {
                    data: {
                        removeFromCart: {
                            cartItems: [{
                                id: '11',
                                src: 'merch.jpg',
                                name: 'TEST MERCH',
                                price: 99.99,
                                quantity: 3
                            }],
                            total: 299.97
                        }
                    }
                }
            }
        }, { 
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 3
                        }],
                        total: 299.97
                    }
                }
            }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <CartSection />
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText('TEST MERCH')).toBeInTheDocument()
            expect(screen.getByText('TEST MERCH 2')).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('removeFromCart-12'))
        await waitFor(() => {
            expect(mutationCalled).toBe(true)
            expect(screen.getByText('TEST MERCH')).toBeInTheDocument()
            expect(screen.getByText('£299.97')).toBeInTheDocument()
        })
    })

    test('Should produce a network error when trying to remove from cart', async () => {
        const mocks = [{
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 3
                        }],
                        total: 299.97
                    }
                }
            }
        }, {
            request: {
                query: REMOVE_FROM_CART,
                variables: {
                    idProvided: '11'
                }
            },
            error: 'Displaying Network Error'
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <BrowserRouter>
                    <CartSection />
                </BrowserRouter>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText('TEST MERCH')).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('removeFromCart-11'))
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('Network Error'))
        await waitFor(() => {
            expect(screen.getByText(/Displaying Network Error/i)).toBeInTheDocument()
        })
    })

    test('Should produce a GraphQL error when trying to remove from cart', async () => {
        const mocks = [{
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 3
                        }],
                        total: 299.97
                    }
                }
            }
        }, {
            request: {
                query: REMOVE_FROM_CART,
                variables: {
                    idProvided: '11'
                }
            },
            result: {
                errors: [new GraphQLError('Displaying GraphQL Error')]
            }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <BrowserRouter>
                    <CartSection />
                </BrowserRouter>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText('TEST MERCH')).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('removeFromCart-11'))
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
            expect(screen.getByText(/Displaying GraphQL Error/i)).toBeInTheDocument()
        })
    })

    test('Should update quantity of item in cart', async () => {
        let mutationCalled = false
        const mocks = [{
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 3
                        }],
                        total: 299.97
                    }
                }
            }
        }, {
            request: {
                query: UPDATE_QUANTITY,
                variables: {
                    idProvided: '11',
                    newQuantity: 4
                }
            },
            result: () => {
                mutationCalled = true
                return {
                    data: {
                        updateCart: {
                            cartItems: [{
                                id: '11',
                                src: 'merch.jpg',
                                name: 'TEST MERCH',
                                price: 99.99,
                                quantity: 4
                            }],
                            total: 399.96
                        }
                    }
                }
            }
        }, { 
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 4
                        }],
                        total: 399.96
                    }
                }
            }
        }]
        const { debug } = render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <CartSection />
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText('TEST MERCH')).toBeInTheDocument()
            expect(screen.getAllByText('£299.97'))
        })
        // UserEvent.type(screen.getByTestId('updateQuantity-11'), '{backspace}') // - This produces an Apollo Error :(
        fireEvent.change(screen.getByTestId('updateQuantity-11'), { target: { value: '4' } })
        debug()
        await waitFor(() => {
            expect(screen.getByTestId('updateQuantity-11')).toHaveValue(4)
            expect(mutationCalled).toBe(true)
            expect(screen.getByText('TEST MERCH')).toBeInTheDocument()
            expect(screen.getAllByText('£399.96'))
        })
    })

    test('Should set quantity of item to 1 for invalid quantity in cart', async () => {
        let mutationCalled = false
        const mocks = [{
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 3
                        }],
                        total: 299.97
                    }
                }
            }
        }, {
            request: {
                query: UPDATE_QUANTITY,
                variables: {
                    idProvided: '11',
                    newQuantity: 1
                }
            },
            result: () => {
                mutationCalled = true
                return {
                    data: {
                        updateCart: {
                            cartItems: [{
                                id: '11',
                                src: 'merch.jpg',
                                name: 'TEST MERCH',
                                price: 99.99,
                                quantity: 1
                            }],
                            total: 99.99
                        }
                    }
                }
            }
        }, { 
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 1
                        }],
                        total: 99.99
                    }
                }
            }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <CartSection />
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText('TEST MERCH')).toBeInTheDocument()
            expect(screen.getAllByText('£299.97'))
        })
        fireEvent.change(screen.getByTestId('updateQuantity-11'), { target: { value: '0' } })
        await waitFor(() => {
            expect(screen.getByTestId('updateQuantity-11')).toHaveValue(1)
            expect(mutationCalled).toBe(true)
            expect(screen.getByText('TEST MERCH')).toBeInTheDocument()
            expect(screen.getAllByText('£99.99'))
        })
    })

    test('Should set quantity of item to an integer if a decimal for the quantity is provided', async () => {
        let mutationCalled = false
        const mocks = [{
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 3
                        }],
                        total: 299.97
                    }
                }
            }
        }, {
            request: {
                query: UPDATE_QUANTITY,
                variables: {
                    idProvided: '11',
                    newQuantity: 2
                }
            },
            result: () => {
                mutationCalled = true
                return {
                    data: {
                        updateCart: {
                            cartItems: [{
                                id: '11',
                                src: 'merch.jpg',
                                name: 'TEST MERCH',
                                price: 99.99,
                                quantity: 2
                            }],
                            total: 199.98
                        }
                    }
                }
            }
        }, { 
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 2
                        }],
                        total: 199.99
                    }
                }
            }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <CartSection />
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText('TEST MERCH')).toBeInTheDocument()
            expect(screen.getAllByText('£299.97'))
        })
        fireEvent.change(screen.getByTestId('updateQuantity-11'), { target: { value: '1.5' } })
        await waitFor(() => {
            expect(screen.getByTestId('updateQuantity-11')).toHaveValue(2)
            expect(mutationCalled).toBe(true)
            expect(screen.getByText('TEST MERCH')).toBeInTheDocument()
            expect(screen.getAllByText('£199.98'))
        })
    })

    test('Should produce a network error when trying to update quantity of item in cart', async () => {
        const mocks = [{
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 3
                        }],
                        total: 299.97
                    }
                }
            }
        }, {
            request: {
                query: UPDATE_QUANTITY,
                variables: {
                    idProvided: '11',
                    newQuantity: 4
                }
            },
            error: 'Displaying Network Error'
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <BrowserRouter>
                    <CartSection />
                </BrowserRouter>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText('TEST MERCH')).toBeInTheDocument()
        })
        fireEvent.change(screen.getByTestId('updateQuantity-11'), { target: { value: '4' } })
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('Network Error'))
        await waitFor(() => {
            expect(screen.getByText(/Displaying Network Error/i)).toBeInTheDocument()
        })
    })

    test('Should produce a GraphQL error when trying to update quantity of item in cart', async () => {
        const mocks = [{
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 3
                        }],
                        total: 299.97
                    }
                }
            }
        }, {
            request: {
                query: UPDATE_QUANTITY,
                variables: {
                    idProvided: '11',
                    newQuantity: 4
                }
            },
            result: {
                errors: [new GraphQLError('Displaying GraphQL Error')]
            }
        }]
        const { debug } = render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <BrowserRouter>
                    <CartSection />
                </BrowserRouter>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText('TEST MERCH')).toBeInTheDocument()
        })
        fireEvent.change(screen.getByTestId('updateQuantity-11'), { target: { value: '4' } })
        debug()
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
            expect(screen.getByText(/Displaying GraphQL Error/i)).toBeInTheDocument()
        })
    })

    test('Should purchase cart', async () => {
        let mutationCalled = false
        const mocks = [{
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 3
                        }],
                        total: 299.97
                    }
                }
            }
        }, {
            request: {
                query: PURCHASE_CART
            },
            result: () => {
                mutationCalled = true
                return {
                    data: {
                        purchaseCart: {
                            cartItems: [],
                            total: 0.00
                        }
                    }
                }
            }
        }, { 
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [],
                        total: 0.00
                    }
                }
            }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <CartSection />
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText('TEST MERCH')).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('purchaseCart'))
        window.alert = jest.fn()
        window.alert.mockClear()
        await waitFor(() => {
            expect(mutationCalled).toBe(true)
            expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
        })
    })

    test('Should produce a network error when trying to purchase cart', async () => {
        const mocks = [{
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 3
                        }],
                        total: 299.97
                    }
                }
            }
        }, {
            request: {
                query: PURCHASE_CART
            },
            error: 'Displaying Network Error'
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <BrowserRouter>
                    <CartSection />
                </BrowserRouter>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText('TEST MERCH')).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('purchaseCart'))
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('Network Error'))
        await waitFor(() => {
            expect(screen.getByText(/Displaying Network Error/i)).toBeInTheDocument()
        })
    })

    test('Should produce a GraphQL error when trying to purchase cart', async () => {
        const mocks = [{
            request: {
                query: GET_CART
            },
            result: {
                data: {
                    allCart: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        },
                        cartItems: [{
                            id: '11',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 3
                        }],
                        total: 299.97
                    }
                }
            }
        }, {
            request: {
                query: PURCHASE_CART
            },
            result: {
                errors: [new GraphQLError('Displaying GraphQL Error')]
            }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <BrowserRouter>
                    <CartSection />
                </BrowserRouter>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText('TEST MERCH')).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('purchaseCart'))
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
            expect(screen.getByText(/Displaying GraphQL Error/i)).toBeInTheDocument()
        })
    })

})