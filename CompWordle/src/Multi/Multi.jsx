import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {io} from "socket.io-client"



export default function Multi() {

    const [test, setTest] = useState("")

    const {id} = useParams()

    useEffect(() => {
        const socket = io("http://localhost:8000")

        socket.emit("join_game", id)
        socket.on("message", () => {
            console.log("connection!!")
        })
        setTest(id)

        return () => socket.disconnect()

    }, [])


    return <p>siema lol {test}</p>
}