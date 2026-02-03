import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./ranking.css"

export default function Ranking() {

    const [top10, setTop10] = useState([])

    useEffect(() => {
        async function getUsers() {
            const d = await fetch("http://localhost:8000/ranking?top=10").then(o => o.json())

            setTop10(d)
        }

        getUsers()
    }, [])

    return (
        <div id="ranking">
            <h1 style={{textAlign: "center"}}>Top 10:</h1>
            {top10.map((n, index) => (
                <Link to={`/u/${n.id}`} key={`${n.id}${index}`}>
                    {`${index + 1}`}. {n.name} | {n.points} | {Math.round((n.wins / (n.wins + n.losses)) * 10000) / 100}%
                </Link>
            ))}
        </div>
    )

}