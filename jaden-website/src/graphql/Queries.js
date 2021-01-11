import { gql } from '@apollo/client'

export const TOURS = gql`
    query {
        tours {
            date
            city
            link
            arena
        }
    }
`
const CHECK = ''

// export default { TOURS, CHECK }