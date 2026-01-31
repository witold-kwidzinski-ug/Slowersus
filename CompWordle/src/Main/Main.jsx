import { useEffect, useState } from "react"
import CreateButton from "../Compontents/main/CreateButton"

export default function Main() {

    const [games, setGames] = useState([])

    useEffect(() => {
        async function getGames() {
            const g = await fetch("http://localhost:8000/games").then(o => o.json())
            setGames(g)
        }
        
        getGames()
    }, [])

    return (
        <>
            <p>main site</p>

            {games.length > 0 && games.map(n => <p key={`${n.gameid}`}>{n.gameid}</p>)}

            <CreateButton />
        </>
    )
}