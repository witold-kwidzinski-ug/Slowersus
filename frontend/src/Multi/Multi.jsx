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

    const isHost = useRef(false)

    const [canWrite, setCanWrite] = useState(false)
    const [canStart, setCanStart] = useState(false)


    const [words, setWords] = useState([])
    const [letters, setLetters] = useState(defaultLetters)
    const [liveGuess, setLiveGuess] = useState([])

    const [enemyWords, setEnemyWords] = useState([])

    useEffect(() => {
        if (!id || !keycloak.tokenParsed.sub) return

        socket.current = io({
            auth: (callback) => {
                callback({
                    token: keycloak.token
                });
            }
        })

        const onStartGame = () => {
            setCanWrite(true)
            setCanStart(false)
        }
        
        socket.current.on("start_game", onStartGame)

        const onGameJoined = (gameinfo) => {
            if (gameinfo.status === "active") {
                if (gameinfo.p1.id === keycloak.tokenParsed.sub) {
                    setWords(gameinfo.p1.guesses)
                    setEnemyWords(gameinfo.p2.guesses)

                    setLetters(() => {
                        let newLetters = {...defaultLetters}

                        gameinfo.p1.guesses.forEach(word => {
                            newLetters = Object.keys(newLetters).reduce((acc, el) => {
                                if (!word.find(n => n.letter === el)) {
                                    return {...acc, [el]: newLetters[el]}
                                }

                                if (newLetters[el] !== "darkgrey" || newLetters[el] === "lime") {
                                    return {...acc, [el]: newLetters[el]}
                                }

                                return {...acc, [el]: word.find(n => n.letter === el).color}

                            }, {})
                        })

                        return newLetters
                    })

                }
                else if (gameinfo.p2.id === keycloak.tokenParsed.sub) {
                    setWords(gameinfo.p2.guesses)
                    setEnemyWords(gameinfo.p1.guesses)

                    setLetters(() => {
                        let newLetters = {...defaultLetters}

                        gameinfo.p2.guesses.forEach(word => {
                            newLetters = Object.keys(newLetters).reduce((acc, el) => {
                                if (!word.find(n => n.letter === el)) {
                                    return {...acc, [el]: newLetters[el]}
                                }

                                if (newLetters[el] !== "darkgrey" || newLetters[el] === "lime") {
                                    return {...acc, [el]: newLetters[el]}
                                }

                                return {...acc, [el]: word.find(n => n.letter === el).color}

                            }, {})
                        })

                        return newLetters
                    })

                } else {
                    return
                }
                setCanWrite(true)
                setCanStart(false)
                isHost.current = keycloak.tokenParsed.sub === gameinfo.p1.id
            } else {
                setCanWrite(false)
                setWords([])
                setEnemyWords([])
                setLetters(defaultLetters)
                setLiveGuess([])
                setCanStart(keycloak.tokenParsed.sub === gameinfo.p1.id && gameinfo.p2.id !== null)
                isHost.current = keycloak.tokenParsed.sub === gameinfo.p1.id
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

                    if (prev[el] !== "darkgrey" || prev[el] === "lime") {
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
            socket.current.emit("join_game", {gameid: id})
        }
        
        socket.current.on("connect", onConnect)

        const onWin = ({pid, answer}) => {
            let result
            if (keycloak.tokenParsed.sub === pid) {
                result = "win"
            } else {
                result = "lose"
                
            }

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

        const onCancelled = ({message}) => {
            setCanWrite(false)
            setCanStart(false)
            console.log(message)
        }

        socket.current.on("game_cancelled", onCancelled)


        return () => {
            socket.current.off("start_game", onStartGame)
            socket.current.off("game_joined", onGameJoined)
            socket.current.off("newguess", onNewGuess)
            socket.current.off("connect", onConnect)
            socket.current.off("win", onWin)
            socket.current.off("reset", onReset)
            socket.current.off("draw", onDraw)
            socket.current.off("game_cancelled", onCancelled)
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