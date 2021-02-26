import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import UserEvent from '@testing-library/user-event'
import { GET_CART } from '../graphql/Queries'
import { USER_INFO, SIGN_IN, SIGN_UP } from '../graphql/Mutations'
import { MockedProvider } from '@apollo/client/testing'
import { GraphQLError } from 'graphql'
import ProfileOptions from './ProfileOptions'
import AuthProvider from './AuthProvider'
import AppRouter from './AppRouter'

describe('<ProfileOptions />', () => {

    test('Should sign user in', async () => {
        const mocks = [{
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
            }, {
            request: {
                query: SIGN_IN,
                variables: {
                    credentials: {
                        email: 'test@test.com',
                        password: 'password'
                    }
                }
            },
            result: {
                data: {
                    signIn: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        }
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
                        user: {
                            id: '1',
                            email: 'test@test.com',
                            cart: null
                        }
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
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN IN')).toHaveLength(4)
        })
        UserEvent.type(screen.getByTestId('signInEmail'), 'test@test.com')        
        UserEvent.type(screen.getByTestId('signInPassword'), 'password')
        UserEvent.click(screen.getByTestId('signIn'))
        await waitFor(() => {
            expect(screen.getByText('CTV3 OUT NOW')).toBeInTheDocument()
            expect(screen.getAllByText('ACCOUNT')).toHaveLength(2)
        })
    })

    test('Should inform user that email format inputted is not valid when trying to sign in', async () => {
        const mocks = [{
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
            }, {
            request: {
                query: SIGN_IN,
                variables: {
                    credentials: {
                        email: 'test',
                        password: 'password'
                    }
                }
            },
            error: {
                result: {
                    errors: [{
                        message: 'Must be email format',
                        extensions: {
                            exception: {
                                fieldName: 'email'
                            }
                        }
                    }]
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
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN IN')).toHaveLength(4)
        })
        UserEvent.type(screen.getByTestId('signInEmail'), 'test')        
        UserEvent.type(screen.getByTestId('signInPassword'), 'password')
        UserEvent.click(screen.getByTestId('signIn'))
        await waitFor(() => {
            expect(screen.getByText('Must be email format')).toBeInTheDocument()
        })
    })

    test('Should inform user that password inputted is not long enough when trying to sign in', async () => {
        const mocks = [{
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
            }, {
            request: {
                query: SIGN_IN,
                variables: {
                    credentials: {
                        email: 'test@test.com',
                        password: 'passwor'
                    }
                }
            },
            error: {
                result: {
                    errors: [{
                        message: 'Password must be 8 characters long',
                        extensions: {
                            exception: {
                                fieldName: 'password'
                            }
                        }
                    }]
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
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN IN')).toHaveLength(4)
        })
        UserEvent.type(screen.getByTestId('signInEmail'), 'test@test.com')        
        UserEvent.type(screen.getByTestId('signInPassword'), 'passwor')
        UserEvent.click(screen.getByTestId('signIn'))
        await waitFor(() => {
            expect(screen.getByText('Password must be 8 characters long')).toBeInTheDocument()
        })
    })

    test('Should inform user that email is already registered when trying to sign in', async () => {
        const mocks = [{
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
            }, {
            request: {
                query: SIGN_IN,
                variables: {
                    credentials: {
                        email: 'test',
                        password: 'password'
                    }
                }
            },
            result: {
                errors: [{
                    message: 'Email already registered',
                    extensions: {
                        invalidArgs: 'Email'
                    } 
                }]
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
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN IN')).toHaveLength(4)
        })
        UserEvent.type(screen.getByTestId('signInEmail'), 'test')        
        UserEvent.type(screen.getByTestId('signInPassword'), 'password')
        UserEvent.click(screen.getByTestId('signIn'))
        await waitFor(() => {
            expect(screen.getByText('Email already registered')).toBeInTheDocument()
        })
    })

    test('Should inform user that password is incorrect when trying to sign in', async () => {
        const mocks = [{
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
            }, {
            request: {
                query: SIGN_IN,
                variables: {
                    credentials: {
                        email: 'test@test.com',
                        password: 'passwordd'
                    }
                }
            },
            result: {
                errors: [{
                    message: 'Password incorrect',
                    extensions: {
                        invalidArgs: 'Password'
                    } 
                }]
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
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN IN')).toHaveLength(4)
        })
        UserEvent.type(screen.getByTestId('signInEmail'), 'test@test.com')        
        UserEvent.type(screen.getByTestId('signInPassword'), 'passwordd')
        UserEvent.click(screen.getByTestId('signIn'))
        await waitFor(() => {
            expect(screen.getByText('Password incorrect')).toBeInTheDocument()
        })
    })

    test('Should produce a known network error when trying to sign in', async () => {
        const mocks = [{
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
            }, {
            request: {
                query: SIGN_IN,
                variables: {
                    credentials: {
                        email: 'test@test.com',
                        password: 'password'
                    }
                }
            },
            error: new Error('Failed to fetch')
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN IN')).toHaveLength(4)
        })
        UserEvent.type(screen.getByTestId('signInEmail'), 'test@test.com')        
        UserEvent.type(screen.getByTestId('signInPassword'), 'password')
        UserEvent.click(screen.getByTestId('signIn'))
        await waitFor(() => {
            expect(screen.getByText('Server Offline')).toBeInTheDocument()
        })
    })

    test('Should produce an unknown network error when trying to sign in', async () => {
        const mocks = [{
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
            }, {
            request: {
                query: SIGN_IN,
                variables: {
                    credentials: {
                        email: 'test@test.com',
                        password: 'password'
                    }
                }
            },
            error: new Error('Displaying Network Error')
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN IN')).toHaveLength(4)
        })
        UserEvent.type(screen.getByTestId('signInEmail'), 'test@test.com')        
        UserEvent.type(screen.getByTestId('signInPassword'), 'password')
        UserEvent.click(screen.getByTestId('signIn'))
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('Network Error'))
        await waitFor(() => {
            expect(screen.getByText(/Displaying Network Error/i)).toBeInTheDocument()
        })
    })

    test('Should produce an unknown GraphQL error when trying to sign in', async () => {
        const mocks = [{
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
            }, {
            request: {
                query: SIGN_IN,
                variables: {
                    credentials: {
                        email: 'test@test.com',
                        password: 'password'
                    }
                }
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
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN IN')).toHaveLength(4)
        })
        UserEvent.type(screen.getByTestId('signInEmail'), 'test@test.com')        
        UserEvent.type(screen.getByTestId('signInPassword'), 'password')
        UserEvent.click(screen.getByTestId('signIn'))
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
            expect(screen.getByText(/Displaying GraphQL Error/i)).toBeInTheDocument()
        })
    })

    test('Should sign user up', async () => {
        const mocks = [{
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
            }, {
            request: {
                query: SIGN_UP,
                variables: {
                    credentials: {
                        email: 'test@test.com',
                        password: 'password'
                    }
                }
            },
            result: {
                data: {
                    signUp: {
                        user: {
                            id: '1',
                            email: 'test@test.com'
                        }
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
                        user: {
                            id: '1',
                            email: 'test@test.com',
                            cart: null
                        }
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
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN UP')).toHaveLength(1)
        })
        UserEvent.click(screen.getByText('SIGN UP'))
        await waitFor(() => {
            expect(screen.getByText('New Password')).toBeInTheDocument()
        })
        UserEvent.type(screen.getByTestId('signUpEmail'), 'test@test.com')        
        UserEvent.type(screen.getByTestId('signUpPassword'), 'password')
        UserEvent.type(screen.getByTestId('signUpRetypedPassword'), 'password')
        UserEvent.click(screen.getByTestId('signUp'))
        await waitFor(() => {
            expect(screen.getByText('CTV3 OUT NOW')).toBeInTheDocument()
            expect(screen.getAllByText('ACCOUNT')).toHaveLength(2)
        })
    })

    test('Should prevent user signing up, due to empty fields', async () => {
        const mocks = [{
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
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN UP')).toHaveLength(1)
        })
        UserEvent.click(screen.getByText('SIGN UP'))
        await waitFor(() => {
            expect(screen.getByText('New Password')).toBeInTheDocument()
        })
        UserEvent.type(screen.getByTestId('signUpEmail'), '')        
        UserEvent.type(screen.getByTestId('signUpPassword'), '')
        UserEvent.type(screen.getByTestId('signUpRetypedPassword'), '')
        UserEvent.click(screen.getByTestId('signUp'))
        await waitFor(() => {
            expect(screen.getByText('Fields cant be empty')).toBeInTheDocument()
        })
    })

    test('Should prevent user signing up, due to non matching passwords', async () => {
        const mocks = [{
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
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN UP')).toHaveLength(1)
        })
        UserEvent.click(screen.getByText('SIGN UP'))
        await waitFor(() => {
            expect(screen.getByText('New Password')).toBeInTheDocument()
        })
        UserEvent.type(screen.getByTestId('signUpEmail'), 'test@test.com')        
        UserEvent.type(screen.getByTestId('signUpPassword'), 'password')
        UserEvent.type(screen.getByTestId('signUpRetypedPassword'), 'passwor')
        UserEvent.click(screen.getByTestId('signUp'))
        await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
        })
    })

    test('Should inform user that email format inputted is not valid when trying to sign up', async () => {
        const mocks = [{
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
            }, {
                request: {
                    query: SIGN_UP,
                    variables: {
                        credentials: {
                            email: 'test',
                            password: 'password'
                        }
                    }
                },
                error: {
                    result: {
                        errors: [{
                            message: 'Must be email format',
                            extensions: {
                                exception: {
                                    fieldName: 'email'
                                }
                            }
                        }]
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
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN UP')).toHaveLength(1)
        })
        UserEvent.click(screen.getByText('SIGN UP'))
        await waitFor(() => {
            expect(screen.getByText('New Password')).toBeInTheDocument()
        })
        UserEvent.type(screen.getByTestId('signUpEmail'), 'test')        
        UserEvent.type(screen.getByTestId('signUpPassword'), 'password')
        UserEvent.type(screen.getByTestId('signUpRetypedPassword'), 'password')
        UserEvent.click(screen.getByTestId('signUp'))
        await waitFor(() => {
            expect(screen.getByText('Must be email format')).toBeInTheDocument()
        })
    })

    test('Should inform user that password inputted is not long enough when trying to sign up', async () => {
        const mocks = [{
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
            }, {
                request: {
                    query: SIGN_UP,
                    variables: {
                        credentials: {
                            email: 'test@test.com',
                            password: 'passwor'
                        }
                    }
                },
                error: {
                    result: {
                        errors: [{
                            message: 'Password must be 8 characters long',
                            extensions: {
                                exception: {
                                    fieldName: 'password'
                                }
                            }
                        }]
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
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN UP')).toHaveLength(1)
        })
        UserEvent.click(screen.getByText('SIGN UP'))
        await waitFor(() => {
            expect(screen.getByText('New Password')).toBeInTheDocument()
        })
        UserEvent.type(screen.getByTestId('signUpEmail'), 'test@test.com')        
        UserEvent.type(screen.getByTestId('signUpPassword'), 'passwor')
        UserEvent.type(screen.getByTestId('signUpRetypedPassword'), 'passwor')
        UserEvent.click(screen.getByTestId('signUp'))
        await waitFor(() => {
            expect(screen.getByText('Password must be 8 characters long')).toBeInTheDocument()
        })
    })

    test('Should produce a known network error when trying to sign up', async () => {
        const mocks = [{
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
            }, {
                request: {
                    query: SIGN_UP,
                    variables: {
                        credentials: {
                            email: 'test@test.com',
                            password: 'password'
                        }
                    }
                },
                error: new Error('Failed to fetch')
            }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN UP')).toHaveLength(1)
        })
        UserEvent.click(screen.getByText('SIGN UP'))
        await waitFor(() => {
            expect(screen.getByText('New Password')).toBeInTheDocument()
        })
        UserEvent.type(screen.getByTestId('signUpEmail'), 'test@test.com')        
        UserEvent.type(screen.getByTestId('signUpPassword'), 'password')
        UserEvent.type(screen.getByTestId('signUpRetypedPassword'), 'password')
        UserEvent.click(screen.getByTestId('signUp'))
        await waitFor(() => {
            expect(screen.getByText('Server Offline')).toBeInTheDocument()
        })
    })

    test('Should produce an unknown network error when trying to sign up', async () => {
        const mocks = [{
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
            }, {
                request: {
                    query: SIGN_UP,
                    variables: {
                        credentials: {
                            email: 'test@test.com',
                            password: 'password'
                        }
                    }
                },
                error: new Error('Displaying Network Error')
            }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN UP')).toHaveLength(1)
        })
        UserEvent.click(screen.getByText('SIGN UP'))
        await waitFor(() => {
            expect(screen.getByText('New Password')).toBeInTheDocument()
        })
        UserEvent.type(screen.getByTestId('signUpEmail'), 'test@test.com')        
        UserEvent.type(screen.getByTestId('signUpPassword'), 'password')
        UserEvent.type(screen.getByTestId('signUpRetypedPassword'), 'password')
        UserEvent.click(screen.getByTestId('signUp'))
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
        })
        UserEvent.click(screen.getByTestId('Network Error'))
        await waitFor(() => {
            expect(screen.getByText(/Displaying Network Error/i)).toBeInTheDocument()
        })
    })

    test('Should inform user that email is already registered when trying to sign up', async () => {
        const mocks = [{
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
            }, {
                request: {
                    query: SIGN_UP,
                    variables: {
                        credentials: {
                            email: 'test@test.com',
                            password: 'passwor'
                        }
                    }
                },
                result: {
                    errors: [{
                        message: 'Email already registered',
                        extensions: {
                            invalidArgs: 'Email'
                        } 
                    }]
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
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN UP')).toHaveLength(1)
        })
        UserEvent.click(screen.getByText('SIGN UP'))
        await waitFor(() => {
            expect(screen.getByText('New Password')).toBeInTheDocument()
        })
        UserEvent.type(screen.getByTestId('signUpEmail'), 'test@test.com')        
        UserEvent.type(screen.getByTestId('signUpPassword'), 'passwor')
        UserEvent.type(screen.getByTestId('signUpRetypedPassword'), 'passwor')
        UserEvent.click(screen.getByTestId('signUp'))
        await waitFor(() => {
            expect(screen.getByText('Email already registered')).toBeInTheDocument()
        })
    })

    test('Should produce an unknown GraphQL error when trying to sign up', async () => {
        const mocks = [{
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
            }, {
                request: {
                    query: SIGN_UP,
                    variables: {
                        credentials: {
                            email: 'test@test.com',
                            password: 'password'
                        }
                    }
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
            expect(screen.getAllByText('SIGN IN'))
        })
        UserEvent.click(screen.getByTestId('Account'))
        await waitFor(() => {
            expect(screen.getAllByText('SIGN UP')).toHaveLength(1)
        })
        UserEvent.click(screen.getByText('SIGN UP'))
        await waitFor(() => {
            expect(screen.getByText('New Password')).toBeInTheDocument()
        })
        UserEvent.type(screen.getByTestId('signUpEmail'), 'test@test.com')        
        UserEvent.type(screen.getByTestId('signUpPassword'), 'password')
        UserEvent.type(screen.getByTestId('signUpRetypedPassword'), 'password')
        UserEvent.click(screen.getByTestId('signUp'))
        await waitFor(() => {
            expect(screen.getByText(/UNKNOWN ERROR/i)).toBeInTheDocument()
            expect(screen.getByText(/Displaying GraphQL Error/i)).toBeInTheDocument()
        })
    })

})