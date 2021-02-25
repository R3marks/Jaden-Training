import { useContext, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { AuthContext } from './AuthProvider'
import { USER_INFO } from '../graphql/Mutations'

function useAppInit() {
    const [getUserInfo, { loading, error }] = useMutation(USER_INFO)
    const { setAuthInfo }  = useContext(AuthContext)

    useEffect(() => {
        async function handleSession() {
            try {
                var result = await getUserInfo()
                setAuthInfo({ userData: result.data.userInfo.user })
            } catch (errors) {
                console.log(errors)
            }
        }
        handleSession();
    }, [setAuthInfo, getUserInfo])

    return loading
}

export default useAppInit
