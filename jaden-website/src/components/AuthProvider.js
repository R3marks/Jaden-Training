import React, { useState } from 'react'

export const AuthContext = React.createContext()
const Provider = AuthContext.Provider

function AuthProvider({ children }) {

    const [authInfo, setAuthInfo] = useState({
        token: null,
        userData: {}
    })
    console.log(authInfo.token)

    function isAuthenticated() {
        if (authInfo.token !== null) {
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
