import { useNavigate } from "react-router-dom"
import { useUserInfo } from "../../../contexts/UserInfoContext"


export default function CreateButton() {

    const {state} = useUserInfo()

    const navigate = useNavigate()

    async function handleNewGame() {
        const newid = await fetch("http://localhost:8000/games", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    userId: state.id

                })
        }).then(o => o.text())

        console.log(newid)

        navigate(`/multi/${newid}`)
    }

    return (
        <button onClick={handleNewGame}>Create Game</button>
    )
}