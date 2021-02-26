import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import UserEvent from '@testing-library/user-event'
import { GET_CART } from '../graphql/Queries'
import { USER_INFO, SIGN_OUT, DELETE_USER } from '../graphql/Mutations'
import { MockedProvider } from '@apollo/client/testing'
import { GraphQLError } from 'graphql'
import ProfileOptions from './ProfileOptions'
import AuthProvider from './AuthProvider'
import AppRouter from './AppRouter'

describe('<ProfileOptions />', () => {

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
                <AuthProvider>
                    <ProfileOptions />
                </AuthProvider>
            </MockedProvider>
        )
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
    })

    test('Should display user data', async () => {
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
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider>
                    <ProfileOptions />
                </AuthProvider>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText('test@test.com')).toBeInTheDocument()
            expect(screen.getByText('£299.97')).toBeInTheDocument()
        })
    })

    test('Should produce an known network error when collecting cart data', async () => {
        const mocks = [{
                request: {
                    query: GET_CART
                },
                error: new Error('Failed to fetch')
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider>
                    <ProfileOptions />
                </AuthProvider>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText('Server Offline')).toBeInTheDocument()
        })
    })

    test('Should produce an unknown network error when collecting cart data', async () => {
        const mocks = [{
                request: {
                    query: GET_CART
                },
                error: 'Displaying Network Error'
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider>
                    <ProfileOptions />
                </AuthProvider>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('Network Error'))
        await waitFor(() => {
            expect(screen.getByText(/Displaying Network Error/i)).toBeInTheDocument()
        })
    })

    test('Should produce a GraphQL error when collecting cart data', async () => {
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
                <AuthProvider>
                    <ProfileOptions />
                </AuthProvider>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
            expect(screen.getByText(/Displaying GraphQL Error/i)).toBeInTheDocument()
        })
    })

    test('Should sign out user', async () => {
        const mocks = [{
                request: {
                    query: USER_INFO
                },
                result: {
                    data: {
                        userInfo: {
                            user: {
                                id: '1',
                                email: 'test@test.com',
                                cart: {
                                    total: 299.97
                                }
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
                query: SIGN_OUT
            },
            result: {
                data: {
                    signOut: {
                        user: null
                    }
                }
            }
        }, {
            request: {
                query: USER_INFO
            },
            result: {
                data: {
                    userInfo: {
                        user: null
                    }
                }
            }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </MockedProvider>
        )
        // To have the user access the Router, they need to start from the Home page before accessing their profile, which takes them back to the Home page
        await waitFor(() => {
            expect(screen.getAllByText('ACCOUNT'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getByText('PROFILE')).toBeInTheDocument()
            expect(screen.getByText('test@test.com')).toBeInTheDocument()
            expect(screen.getByText('£299.97')).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('signOut'))
        await waitFor(() => {
            expect(screen.getByText('CTV3 OUT NOW')).toBeInTheDocument()
            expect(screen.getAllByText('SIGN IN'))
        })
    })

    test('Should produce a network error when trying to sign out user', async () => {
        const mocks = [{
                request: {
                    query: USER_INFO
                },
                result: {
                    data: {
                        userInfo: {
                            user: {
                                id: '1',
                                email: 'test@test.com',
                                cart: {
                                    total: 299.97
                                }
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
                query: SIGN_OUT
            },
            error: 'Displaying Network Error'
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getAllByText('ACCOUNT'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getByText('PROFILE')).toBeInTheDocument()
            expect(screen.getByText('test@test.com')).toBeInTheDocument()
            expect(screen.getByText('£299.97')).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('signOut'))
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('Network Error'))
        await waitFor(() => {
            expect(screen.getByText(/Displaying Network Error/i)).toBeInTheDocument()
        })
    })

    test('Should produce a GraphQL error when trying to sign out user', async () => {
        const mocks = [{
                request: {
                    query: USER_INFO
                },
                result: {
                    data: {
                        userInfo: {
                            user: {
                                id: '1',
                                email: 'test@test.com',
                                cart: {
                                    total: 299.97
                                }
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
                query: SIGN_OUT
            },
            result: {
                errors: [new GraphQLError('Displaying GraphQL Error')]
            }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getAllByText('ACCOUNT'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getByText('PROFILE')).toBeInTheDocument()
            expect(screen.getByText('test@test.com')).toBeInTheDocument()
            expect(screen.getByText('£299.97')).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('signOut'))
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
            expect(screen.getByText(/Displaying GraphQL Error/i)).toBeInTheDocument()
        })
    })

    test('Should delete user\'s profile', async () => {
        const mocks = [{
                request: {
                    query: USER_INFO
                },
                result: {
                    data: {
                        userInfo: {
                            user: {
                                id: '1',
                                email: 'test@test.com',
                                cart: {
                                    total: 299.97
                                }
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
                query: DELETE_USER
            },
            result: {
                data: {
                    deleteUser: {
                        user: null
                    }
                }
            }
        }, {
            request: {
                query: USER_INFO
            },
            result: {
                data: {
                    userInfo: {
                        user: null
                    }
                }
            }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getAllByText('ACCOUNT'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getByText('PROFILE')).toBeInTheDocument()
            expect(screen.getByText('test@test.com')).toBeInTheDocument()
            expect(screen.getByText('£299.97')).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('deleteProfile'))
        await waitFor(() => {
            expect(screen.getByText('CTV3 OUT NOW')).toBeInTheDocument()
            expect(screen.getAllByText('SIGN IN'))
        })
    })

    test('Should produce a network error when trying to delete user\'s account', async () => {
        const mocks = [{
                request: {
                    query: USER_INFO
                },
                result: {
                    data: {
                        userInfo: {
                            user: {
                                id: '1',
                                email: 'test@test.com',
                                cart: {
                                    total: 299.97
                                }
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
                query: DELETE_USER
            },
            error: 'Displaying Network Error'
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getAllByText('ACCOUNT'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getByText('PROFILE')).toBeInTheDocument()
            expect(screen.getByText('test@test.com')).toBeInTheDocument()
            expect(screen.getByText('£299.97')).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('deleteProfile'))
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('Network Error'))
        await waitFor(() => {
            expect(screen.getByText(/Displaying Network Error/i)).toBeInTheDocument()
        })
    })

    test('Should produce a GraphQL error when trying to delete user\'s account', async () => {
        const mocks = [{
                request: {
                    query: USER_INFO
                },
                result: {
                    data: {
                        userInfo: {
                            user: {
                                id: '1',
                                email: 'test@test.com',
                                cart: {
                                    total: 299.97
                                }
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
                query: DELETE_USER
            },
            result: {
                errors: [new GraphQLError('Displaying GraphQL Error')]
            }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getAllByText('ACCOUNT'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getByText('PROFILE')).toBeInTheDocument()
            expect(screen.getByText('test@test.com')).toBeInTheDocument()
            expect(screen.getByText('£299.97')).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('deleteProfile'))
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
            expect(screen.getByText(/Displaying GraphQL Error/i)).toBeInTheDocument()
        })
    })

})