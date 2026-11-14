import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import "./u.css"
import keycloak from "../keycloak";

export default function U() {
    const navigate = useNavigate()

    const {id} = useParams()

    const [info, setInfo] = useState(null)

    const canEdit = useRef(false)

    useEffect(() => {
        if (!id || !keycloak.tokenParsed.sub) return

        if (keycloak.tokenParsed.sub === id) {
            canEdit.current = true
        }
        async function getInfo() {
            const d = await fetch(`/api/user/${id}`).then(o => o.json())
            console.log(d)
            setInfo(d)
        }

        getInfo()

        

    }, [id])

    return (
        <>
            {info !== null && <div className="container" style={{backgroundColor: `rgb(255, ${255 - Math.round((info.wins / (info.wins + info.losses)) * 255)}, 0)`}}>
                <div>
                    <h1>{info.name}</h1>
                    {info.bio.length !== 0 ? <p className="info">{info.bio}</p> : <p className="info">This user's bio is empty.</p>}
                </div>
            
                <div className="info">
                    <h3><b>{info.points}</b> points</h3>
                    <p>🎯 <b>{Math.round(info.wins / (info.wins + info.losses) * 10000) / 100}%</b> win rate </p>
                    <p>🏆 Wins: {info.wins}</p>
                    <p>💀 Losses: {info.losses}</p>
                    <p>🔥 Win streak: {info.streak}</p>

                </div>
                
            </div>}
            
            
            {/* w przypadku implementacji usuwania kont
            
            <button onClick={() => {
                if (window.confirm("Are you sure you want to delete the account?")) {
                    fetch(`/api/user/${keycloak.tokenParsed.sub}`, {method: "DELETE"})
                    keycloak.clearToken()
                    navigate("/")
                }
            }}>Delete</button> */}
            
        
        </>
    )

}