import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { useUserInfo } from "../../contexts/UserInfoContext"
import {io} from "socket.io-client"

import { defaultLetters } from "../Multi/defaultLetters"

import P1WordView from "../Compontents/multi/P1WordView"
import P2WordView from "../Compontents/multi/P2WordView"
import GuessedLetters from "../Compontents/multi/GuessedLetters"
import Keyboard from "../Compontents/multi/Keyboard"


export default function Multi() {

    const {state} = useUserInfo()

    const {id} = useParams()

    const socket = useRef(null)
    const joinedRef = useRef(false)

    const [canWrite, setCanWrite] = useState(false)
    const [canStart, setCanStart] = useState(false)


    const [words, setWords] = useState([])
    const [letters, setLetters] = useState(defaultLetters)
    const [liveGuess, setLiveGuess] = useState([])

    const [enemyWords, setEnemyWords] = useState([])

    useEffect(() => {
        if (!id || !state.id) return

        socket.current = io("http://localhost:8000")

        const onStartGame = () => {
            setCanWrite(true)
            setCanStart(false)
        }
        
        socket.current.on("start_game", onStartGame)

        const onGameJoined = (gameinfo) => {
            setCanStart(state.id === gameinfo.p1.id && gameinfo.p2.id !== null)
            console.log("lol")
            console.log(gameinfo)
        }

        socket.current.on("game_joined", onGameJoined)

        const onNewGuess = ({pid, final}) => {
            console.log(final)
            if (state.id === pid) {
                setWords(prev => [...prev, final])
                setLetters(prev => Object.keys(prev).reduce((acc, el) => {
                    if (!final.find(n => n.letter === el)) {
                        return {...acc, [el]: prev[el]}
                    }

                    if (prev[el] !== "whitesmoke" || prev[el] === "green") {
                        return {...acc, [el]: prev[el]}
                    }

                    return {...acc, [el]: final.find(n => n.letter === el).color}

                }, {}))
            } else {
                setEnemyWords(p => [...p, final])
            }
        }

        socket.current.on("newguess", onNewGuess)

        const onConnect = () => {
            if (!joinedRef.current) {
                socket.current.emit("join_game", {gameid: id, pid: state.id})
                joinedRef.current = true
            }
        }
        
        socket.current.on("connect", onConnect)


        return () => {
            socket.current.off("start_game", onStartGame)
            socket.current.off("game_joined", onGameJoined)
            socket.current.off("newguess", onNewGuess)
            socket.current.disconnect()
        }

    }, [id, state.id])


    return (
        <>
            {canStart && !canWrite && <button onClick={() => socket.current.emit("start_game")}>lol</button>}
            <P1WordView words={words} liveGuess={liveGuess} />
            {words.length !== 6 && canWrite && socket.current !== null && <Keyboard setLiveGuess={setLiveGuess} socket={socket} />}
            <GuessedLetters letters={letters} />
            <P2WordView words={enemyWords} />
        </>
        )
}