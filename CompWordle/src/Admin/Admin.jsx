import { useEffect, useState } from "react"
import { useUserInfo } from "../../contexts/UserInfoContext"

export default function Admin() {

    const [isAdmin, setIsAdmin] = useState(false)

    const {state} = useUserInfo()

    useEffect(() => {
        async function validate() {
            const d = await fetch(`http://localhost:8000/validate_admin/${state.id}`, {method: "POST"}).then(o => o.text())

            if (d === "Valid") {
                setIsAdmin(true)
            }
            console.log("hi")

        }
        validate()
    }, [state.id])

    return (
    <>
        {!isAdmin && <p>Access denied.</p>}
        {isAdmin && <>
        <p>Ranking ban/unban</p>
        <form onSubmit={e => {
            e.preventDefault()
            if (e.target.type.value === "ban") {
                fetch(`http://localhost:8000/ranking/${e.target.id.value}`, {method: "DELETE"})
            }
            if (e.target.type.value === "unban") {
                fetch(`http://localhost:8000/ranking/${e.target.id.value}`, {method: "POST"})
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