import { useEffect, useState } from "react"
import CreateButton from "../Compontents/main/CreateButton"
import { useNavigate } from "react-router-dom"
import { useUserInfo } from "../../contexts/UserInfoContext"

export default function Main() {

    const navigate = useNavigate()

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

            {games.length > 0 && games.map(n => <button onClick={() => navigate(`/multi/${n.gameid}`)} key={`${n.gameid}`}>{n.gameid}</button>)}

            <CreateButton />
        </>
    )
}