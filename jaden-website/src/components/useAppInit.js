import { useContext, useEffect} from 'react'
import { useMutation } from '@apollo/client'
import { AuthContext } from './AuthProvider'
import { USER_INFO } from '../graphql/Mutations'

function useAppInit() {
    const [getUserInfo, { loading, error }] = useMutation(USER_INFO)
    const { setAuthinfo } = useContext(AuthContext)

    useEffect(() => {
        async function handleSession() {
            try {
                var result = await getUserInfo()
                setAuthinfo({ userData: result.data.userInfo.user })
            } catch (errors) {
                console.log(errors)
            }
        }
        handleSession()
    }, [setAuthinfo, getUserInfo])

    return loading
}

export default useAppInit
