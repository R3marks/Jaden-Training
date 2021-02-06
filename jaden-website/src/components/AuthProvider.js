import React, { useState } from 'react'

export const AuthContext = React.createContext()
const Provider = AuthContext.Provider

function AuthProvider({ children }) {

    const [authInfo, setAuthInfo] = useState({
        userData: undefined
    })

    console.log(authInfo)

    // const isAuthenticated = () => authInfo.userData !== undefined 

    function isAuthenticated() {
        if (authInfo.userData !== undefined) {
            return true
        } else {
            return false
        }
    }

    return (
        <Provider value={{ authInfo, isAuthenticated, setAuthInfo }}>
            {children}
        </Provider>
    )
}

export default AuthProvider
