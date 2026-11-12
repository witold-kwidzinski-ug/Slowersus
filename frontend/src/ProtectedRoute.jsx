import { useEffect } from "react"
import keycloak from "./keycloak"

export default function ProtectedRoute({children}) {


    function isLoggedIn() {
        if (!keycloak.authenticated) {
            keycloak.login({redirectUri: window.location.href})
            return null
        }
    }

    useEffect(() => {
        isLoggedIn()
    }, [])

    useEffect(() => {
        isLoggedIn()
    }, [keycloak.authenticated])

    if (!keycloak.authenticated) {
        return <p>Redirecting to login page...</p>
    }
  

  return children
}