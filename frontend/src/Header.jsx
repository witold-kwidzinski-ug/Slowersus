import { useNavigate, Link } from "react-router-dom";

import "./header.css"
import keycloak from "./keycloak";

export default function Header() {
    const navigate = useNavigate()

    return (
        <header>
            <Link to='/ranking'>Ranking</Link>
            <Link to='/'>Solo</Link>
            

            <Link to='/main' id="logo">CompWordle</Link>

            <form onSubmit={(e) => {
                e.preventDefault()
                navigate(`/users?search-name=${e.target.search_name.value}`)
            }}>
                <input id="usersearch" placeholder="Search user" type='text' name='search_name'></input>
            </form>

            <div>
                {keycloak.tokenParsed && <Link to={`/u/${keycloak.tokenParsed.sub}`}>{keycloak.tokenParsed.preferred_username}</Link>}

                <button onClick={() => {
                    keycloak.clearToken()
                    navigate("/")
                }}>Logout</button>
            </div>
          
            

            

        </header>
    )
}