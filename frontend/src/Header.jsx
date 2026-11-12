import { useNavigate, Link } from "react-router-dom";

import "./header.css"
import keycloak from "./keycloak";

export default function Header() {
    const navigate = useNavigate()

    return (
        <header>
            <Link to='/ranking'>Ranking</Link>
            <Link to='/'>Solo</Link>
            

            <Link to='/lobbies' id="logo">CompWordle</Link>

            <form onSubmit={(e) => {
                e.preventDefault()
                navigate(`/users?search-name=${e.target.search_name.value}`)
            }}>
                <input id="usersearch" placeholder="Search user" type='text' name='search_name'></input>
            </form>

            <div>
                {keycloak.authenticated && <Link to={`/u/${keycloak.tokenParsed.sub}`}>{keycloak.tokenParsed.preferred_username}</Link>}

                {keycloak.authenticated ? <button onClick={() => {
                    keycloak.logout()
                    navigate("/")
                }}>Logout</button> : <button onClick={() => keycloak.login({redirectUri: window.location.href})}>Login</button>}
                
            </div>
          
            

            

        </header>
    )
}