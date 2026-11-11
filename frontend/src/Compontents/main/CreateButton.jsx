import { useNavigate } from "react-router-dom"


export default function CreateButton() {

    // const {state} = useUserInfo()

    const navigate = useNavigate()

    async function handleNewGame() {
        const newid = await fetch("/api/games", {
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