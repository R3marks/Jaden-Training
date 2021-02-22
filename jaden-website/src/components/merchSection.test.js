import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import UserEvent from '@testing-library/user-event'
import { GET_MERCH } from '../graphql/Queries'
import { ADD_TO_CART } from '../graphql/Mutations'
import { MockedProvider } from '@apollo/client/testing'
import MerchSection from './MerchSection'
import { BrowserRouter } from 'react-router-dom'

describe('<MerchQuery />', () => {
    test('Should initially display loading', () => {
        const mocks = [{
                request: {
                    query: GET_MERCH
                },
                result: {
                    data: {
                        allMerch: [{
                            id: '1',
                            src: 'merch.jpg',
                            name: 'TEST MERCH',
                            price: 99.99
                        }]
                    }
                }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <MerchSection />
            </MockedProvider>
        )
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
    })
    test('Should display returned data from query', async () => {
        const mocks = [{
            request: {
                query: GET_MERCH
            },
            result: {
                data: {
                    allMerch: [{
                        id: '1',
                        src: 'merch.jpg',
                        name: 'TEST MERCH',
                        price: 99.99
                    }]
                }
            }
        }]
        const { container } = render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <MerchSection />
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByAltText('Merch')).toHaveAttribute('src', 'merch.jpg')
            expect(screen.getByText(/TEST MERCH/i)).toBeInTheDocument()
            expect(container.querySelector('[data-key="1"]'))
            expect(screen.getByText(/£99.99/i)).toBeInTheDocument()
        })
    })

    test('Should produce a network error when fetching merch', async () => {
        const mocks = [{
                request: {
                    query: GET_MERCH
                },
                error: new Error('Failed to fetch')
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <MerchSection />
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText(/Server Offline/i)).toBeInTheDocument()
        })
    })

    test('Should add to cart', async () => {
        let mutationCalled = false
        const mocks = [{
            request: {
                query: GET_MERCH
            },
            result: {
                data: {
                    allMerch: [{
                        id: '1',
                        src: 'merch.jpg',
                        name: 'TEST MERCH',
                        price: 99.99
                    }]
                }
            }
        }, {
            request: {
                query: ADD_TO_CART,
                variables: {
                    idProvided: '1'
                }
            },
            result: () => {
                mutationCalled = true
                return {
                    data: {
                        addToCart: {
                            id: '1',
                            src:  'merch.jpg',
                            name: 'TEST MERCH', 
                            price: 99.99, 
                            quantity: 1
                        }
                    }
                }
            }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <MerchSection />
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText(/TEST MERCH/i)).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('addToCart-1'))
        await waitFor(() => {
            expect(mutationCalled).toBe(true)
        })
    })

    test('Should direct the user to log on, if an unauthenticated error message is returned ', async () => {
        const mocks = [{
            request: {
                query: GET_MERCH
            },
            result: {
                data: {
                    allMerch: [{
                        id: '1',
                        src: 'merch.jpg',
                        name: 'TEST MERCH',
                        price: 99.99
                    }]
                }
            }
        }, {
            request: {
                query: ADD_TO_CART,
                variables: {
                    idProvided: '1'
                }
            },
            error: new Error('User has not logged in')
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <BrowserRouter>
                    <MerchSection />
                </BrowserRouter>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText(/TEST MERCH/i)).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('addToCart-1'))
        await waitFor(() => {
            expect(screen.getByText(/You'll need to sign in first before you can add merch to cart/i)).toBeInTheDocument()
        })
    })

    test('Should direct the user to log on, if an unauthenticated error message is returned ', async () => {
        const mocks = [{
            request: {
                query: GET_MERCH
            },
            result: {
                data: {
                    allMerch: [{
                        id: '1',
                        src: 'merch.jpg',
                        name: 'TEST MERCH',
                        price: 99.99
                    }]
                }
            }
        }, {
            request: {
                query: ADD_TO_CART,
                variables: {
                    idProvided: '1'
                }
            },
            error: new Error('Network Error')
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <BrowserRouter>
                    <MerchSection />
                </BrowserRouter>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText(/TEST MERCH/i)).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('addToCart-1'))
        await waitFor(() => {
            expect(screen.getByText(/You'll need to sign in first before you can add merch to cart/i)).toBeInTheDocument()
        })
    })
})