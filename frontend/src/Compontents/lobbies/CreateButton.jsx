import { useNavigate } from "react-router-dom"
import keycloak from "../../keycloak"

export default function CreateButton() {

    const navigate = useNavigate()

    async function handleNewGame() {
        try {
            const newid = await fetch("/api/games", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${keycloak.token}`
                }
            }).then(o => o.text())

            navigate(`/multi/${newid}`)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <button onClick={handleNewGame}>Create Game</button>
    )
}