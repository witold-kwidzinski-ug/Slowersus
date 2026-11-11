import { useEffect, useState } from "react"
import CreateButton from "../Compontents/main/CreateButton"
import { useNavigate } from "react-router-dom"

import "./main.css"

export default function Main() {

    const navigate = useNavigate()

    const [games, setGames] = useState([])


    useEffect(() => {
        async function getGames() {
            const g = await fetch("/api/games").then(o => o.json())
            setGames(g)
        }
        
        getGames()
    }, [])

    return (
        <>
            <h1>Game lobbies</h1>
            <CreateButton />
            <div id="multi">
                {games.length > 0 && games.map(n => <button onClick={() => navigate(`/multi/${n.gameid}`)} key={`${n.gameid}`}>{n.gameid}</button>)}
            </div>
        </>
    )
}