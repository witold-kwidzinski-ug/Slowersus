import { useNavigate, Link } from "react-router-dom";
import { useUserInfo } from "../contexts/UserInfoContext";

import "./header.css"

export default function Header() {
    const navigate = useNavigate()

    const {state, dispatch} = useUserInfo()

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
                <Link to={`/u/${state.id}`}>{state.name}</Link>

                <button onClick={() => {
                    dispatch({type: "LOGOUT"})
                    localStorage.removeItem("userinfo")
                    window.location.replace("/login")
                }}>Logout</button>
            </div>
          
            

            

        </header>
    )
}