import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import {io} from "socket.io-client"

import { defaultLetters } from "../Multi/defaultLetters"

import P1WordView from "../Compontents/multi/P1WordView"
import P2WordView from "../Compontents/multi/P2WordView"
import GuessedLetters from "../Compontents/multi/GuessedLetters"
import Keyboard from "../Compontents/multi/Keyboard"

import "./multi.css"
import keycloak from "../keycloak"

export default function Multi() {

    const {id} = useParams()

    const socket = useRef(null)
    const joinedRef = useRef(false)

    const isHost = useRef(false)

    const [canWrite, setCanWrite] = useState(false)
    const [canStart, setCanStart] = useState(false)


    const [words, setWords] = useState([])
    const [letters, setLetters] = useState(defaultLetters)
    const [liveGuess, setLiveGuess] = useState([])

    const [enemyWords, setEnemyWords] = useState([])

    useEffect(() => {
        if (!id || !keycloak.tokenParsed.sub) return

        socket.current = io()

        const onStartGame = () => {
            setCanWrite(true)
            setCanStart(false)
        }
        
        socket.current.on("start_game", onStartGame)

        const onGameJoined = (gameinfo) => {
            setCanStart(keycloak.tokenParsed.sub === gameinfo.p1.id && gameinfo.p2.id !== null)
            if (keycloak.tokenParsed.sub === gameinfo.p1.id) {
                isHost.current = true
            }
        }

        socket.current.on("game_joined", onGameJoined)

        const onNewGuess = ({pid, final}) => {
            if (keycloak.tokenParsed.sub === pid) {
                setWords(prev => [...prev, final])
                setLetters(prev => Object.keys(prev).reduce((acc, el) => {
                    if (!final.find(n => n.letter === el)) {
                        return {...acc, [el]: prev[el]}
                    }

                    if (prev[el] !== "darkgrey" || prev[el] === "green") {
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
                socket.current.emit("join_game", {gameid: id, pid: keycloak.tokenParsed.sub})
                joinedRef.current = true
            }
        }
        
        socket.current.on("connect", onConnect)

        const onWin = ({pid, answer}) => {
            let result
            if (keycloak.tokenParsed.sub === pid) {
                result = "win"
            } else {
                result = "lose"
                
            }
            fetch(`/api/result/${keycloak.tokenParsed.sub}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        result: result,
                        wordamount: words.length,
                        enemywordamount: enemyWords.length
                    })
                })

            setCanWrite(false)
            window.alert(`You ${result}! Answer: ${answer}`)
            if (isHost.current) {
                setCanStart(true)
            }
            setWords([])
            setLetters(defaultLetters)
            setEnemyWords([])
            setLiveGuess([])
        }

        socket.current.on("win", onWin)

        const onReset = () => {
            setCanWrite(false)
            setCanStart(false)
            setWords([])
            setLetters(defaultLetters)
            setEnemyWords([])
            setLiveGuess([])

        }

        socket.current.on("reset", onReset)

        const onDraw = ({answer}) => {
            setCanWrite(false)
            window.alert(`Draw! | Answer: ${answer}`)
            setWords([])
            setLetters(defaultLetters)
            setEnemyWords([])
            setLiveGuess([])
            if (isHost.current) {
                setCanStart(true)
            }
        }

        socket.current.on("draw", onDraw)


        return () => {
            socket.current.off("start_game", onStartGame)
            socket.current.off("game_joined", onGameJoined)
            socket.current.off("newguess", onNewGuess)
            socket.current.off("win", onWin)
            socket.current.off("reset", onReset)
            socket.current.off("draw", onDraw)
            socket.current.disconnect()
        }

    }, [id, keycloak.tokenParsed.sub])


    return (
        <>
            {canStart && !canWrite && <button onClick={() => socket.current.emit("start_game")}>lol</button>}
            <div id="gameview">
                <div>
                    <P1WordView words={words} liveGuess={liveGuess} />
                    {words.length !== 6 && canWrite && socket.current !== null && <Keyboard setLiveGuess={setLiveGuess} socket={socket} />}
                    <GuessedLetters letters={letters} />
                </div>
                <div>
                    <h1 style={{textAlign: "center"}}>Enemy POV:</h1>
                    <P2WordView words={enemyWords} />
                </div>
            </div>
        </>
        )
}