import { useEffect, useState } from "react"
import keycloak from "../keycloak"

export default function Admin() {

    const [isAdmin, setIsAdmin] = useState(false)

    // const {state} = useUserInfo()

    useEffect(() => {
        if (keycloak.tokenParsed.realm_access.roles.includes("ADMIN")) {
            setIsAdmin(true)
        }
    }, [])

    return (
    <>
        {!isAdmin && <p>Access denied.</p>}
        {isAdmin && <>
        <p>Ranking ban/unban</p>
        <form onSubmit={e => {
            e.preventDefault()
            if (e.target.type.value === "ban") {
                fetch(`/api/ranking/${e.target.id.value}`, {method: "DELETE"})
            }
            if (e.target.type.value === "unban") {
                fetch(`/api/ranking/${e.target.id.value}`, {method: "POST"})
            }
        }}>
            <input type="text" name="id"></input>
            <select name="type">
                <option value="ban">ban</option>
                <option value="unban">unban</option>
            </select>
            <button type="submit">Submit</button>
        </form>
        </>
        }
    </>
    )
}