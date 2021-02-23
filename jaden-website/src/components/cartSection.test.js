import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
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
        }, {
            request: {
                query: REMOVE_FROM_CART,
                variables: {
                    idProvided: '1'
                }
            },
            result: () => {
                mutationCalled = true
                return {
                    data: {
                        removeFromCart: {
                            cartItems: [{

                            }],
                            total: 0.00
                        }
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
        UserEvent.click(screen.getByTestId('removeFromCart-1'))
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
                            id: '1',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99,
                            quantity: 3
                        },{
                            id: '2',
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
                    idProvided: '1'
                }
            },
            result: () => {
                mutationCalled = true
                return {
                    data: {
                        removeFromCart: {
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
        UserEvent.click(screen.getByTestId('removeFromCart-1'))
        await waitFor(() => {
            expect(mutationCalled).toBe(true)
            expect(screen.getByText(/Your cart is empty/i))
        })
    })

})