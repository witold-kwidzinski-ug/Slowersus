import { useNavigate, Link } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate()

    return (
        <header>
          <Link to='/'>Solo</Link>
          <Link to='/main'>Main</Link>
          <form onSubmit={(e) => {
            e.preventDefault()
            navigate(`/users?search-name=${e.target.search_name.value}`)
          }}>
            <input type='text' name='search_name'></input>
            <button type="submit">Search.</button>
          </form>
        </header>
    )
}