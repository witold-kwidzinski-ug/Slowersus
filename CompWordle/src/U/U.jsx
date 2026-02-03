import { useParams } from "react-router-dom";
import { useUserInfo } from "../../contexts/UserInfoContext";
import { useEffect, useRef, useState } from "react";

export default function U() {
    const {state} = useUserInfo()
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
            <p>Name: {info.name}</p>
            <p>Bio: {info.bio}</p>
            <p>Points: {info.points}</p>
        
        </>
    )

}