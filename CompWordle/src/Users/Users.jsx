import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

import "./users.css"

export default function Users() {
    const [params] = useSearchParams()
    const sn = params.get("search-name")

    const [users, setUsers] = useState([])

    useEffect(() => {
        async function getUsers(url) {
            const d = await fetch(url).then(o => o.json())
            setUsers(d)

        }

        if (sn) {
            getUsers(`http://localhost:8000/accounts?search-name=${sn}`)
        } else {
            getUsers(`http://localhost:8000/accounts`)
        }
    }, [sn])


    return (
        <>
            <h1 style={{textAlign: "center"}}>{`Search results for: "${sn}"`}</h1>
            <div id={"userlist"}>
                {users.map(n => (<Link to={`/u/${n.id}`} key={n.id}>{n.name}</Link>))}
            </div>
        </>
        
    )
}