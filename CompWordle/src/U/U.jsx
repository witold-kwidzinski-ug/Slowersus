import { useNavigate, useParams } from "react-router-dom";
import { useUserInfo } from "../../contexts/UserInfoContext";
import { useEffect, useRef, useState } from "react";

import "./u.css"

export default function U() {
    const navigate = useNavigate()

    const {state, dispatch} = useUserInfo()
    const {id} = useParams()

    const [info, setInfo] = useState({})

    const canEdit = useRef(false)

    useEffect(() => {
        if (!id || !state.id) return

        if (state.id === id) {
            canEdit.current = true
        }
        async function getInfo() {
            const d = await fetch(`http://localhost:8000/user/${id}`).then(o => o.json())
            console.log(d)
            setInfo(d)
        }

        getInfo()

        

    }, [id, state.id])

    return (
        <>
            <div className="container">
                <h1>Info</h1>
                <p>Name: {info.name}</p>
                <p>Bio: {info.bio}</p>
            </div>

            <div className="container">
                <h1>Stats</h1>
                <p>Points: {info.points}</p>
                <p>W/L: {Math.round(info.wins / (info.wins + info.losses) * 10000) / 100}% </p>
                <p>Wins: {info.wins} | Losses: {info.losses}</p>
            </div>
            
            <button onClick={() => {
                if (window.confirm("Are you sure you want to delete the account?")) {
                    fetch(`http://localhost:8000/user/${state.id}`, {method: "DELETE"})
                    dispatch({type: "LOGOUT"})
                    localStorage.removeItem("userinfo")
                    navigate("/login")
                }
            }}>Delete</button>
            
        
        </>
    )

}