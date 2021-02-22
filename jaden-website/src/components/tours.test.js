import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Tours from './Tours'
import { SEARCH_TOURS } from '../graphql/Queries'
import { MockedProvider } from '@apollo/client/testing'

describe('<Tours />', () => {
    test('Should initially display loading', () => {
        const mocks = [{
                request: {
                    query: SEARCH_TOURS
                },
                result: {
                    data: {
                        searchTour: [{
                            data: 'JAN 01',
                            city: 'NORWICH, UK',
                            link: 'www.google.com',
                            arena: 'WATERFRONT'
                        }]
                    }
                }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <Tours />
            </MockedProvider>
        )
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
    })

    test('Should display returned data from query', async () => {
        const mocks = [{
                request: {
                    query: SEARCH_TOURS,
                    variables: { searchTerm: '' }
                },
                result: {
                    data: {
                        searchTour: [{
                            date: 'JAN 01',
                            city: 'NORWICH, UK',
                            link: 'www.test.com',
                            arena: 'WATERFRONT'
                        }]
                    }
                }
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <Tours/>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText(/JAN 01/i)).toBeInTheDocument()
            expect(screen.getByText(/NORWICH, UK/i)).toBeInTheDocument()
            expect(screen.getByRole('link')).toHaveAttribute('href', 'www.test.com')
            expect(screen.getByText(/WATERFRONT/i)).toBeInTheDocument()
        })
    })

    test('Should produce a network error', async () => {
        const mocks = [{
                request: {
                    query: SEARCH_TOURS,
                    variables: { searchTerm: '' }
                },
                error: new Error('Failed to fetch')
        }]
        render (
            <MockedProvider mocks={mocks} addTypename={false}>
                <Tours/>
            </MockedProvider>
        )
        await waitFor(() => {
            expect(screen.getByText(/Server Offline/i)).toBeInTheDocument()
        })
    })
})