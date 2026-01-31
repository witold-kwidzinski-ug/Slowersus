import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import {io} from "socket.io-client"

import { defaultLetters } from "../Multi/defaultLetters"

import P1WordView from "../Compontents/multi/P1WordView"
import P2WordView from "../Compontents/multi/P2WordView"
import GuessedLetters from "../Compontents/multi/GuessedLetters"
import Keyboard from "../Compontents/multi/Keyboard"


export default function Multi() {

    const {state} = useUserInfo()

    const {id} = useParams()


    const canWrite = useRef(false)

    const [words, setWords] = useState([])
    const [letters, setLetters] = useState(defaultLetters)
    const [liveGuess, setLiveGuess] = useState([])

    const [enemyWords, setEnemyWords] = useState([])

    useEffect(() => {
        const socket = io("http://localhost:8000")

        socket.emit("join_game", {gameid: id, pid: state.id})
        
        socket.on("start_game", () => {
            canWrite.current = true
        })

        socket.on("newguess", ({pid, final}) => {
            if (state.id === pid) {
                setWords(p => [...p, final])
                setLiveGuess("")
            } else {
                setEnemyWords(p => [...p, final])
            }
        })


        return () => socket.disconnect()

    }, [])


    return (
        <>
            <P1WordView words={words} liveGuess={liveGuess} />
            {words.length !== 6 && <Keyboard setWords={setWords} setLiveGuess={setLiveGuess} setLetters={setLetters} socket={socket} />}
            <GuessedLetters letters={letters} />
            <P2WordView words={enemyWords} />
        </>
        )
}