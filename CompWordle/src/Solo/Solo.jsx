"use client"

import { useEffect, useState } from "react"
import Keyboard from "../Compontents/Keyboard"
import WordView from "../Compontents/WordView"
import "./solo.css"

import { defaultLetters } from "./defaultLetters"
import GuessedLetters from "../Compontents/GuessedLetters"

export default function Solo() {

    const [answer, setAnswer] = useState(null)
    const [words, setWords] = useState([])
    const [letters, setLetters] = useState(defaultLetters)
    const [liveGuess, setLiveGuess] = useState([])

    useEffect(() => {
        async function newWord() {
            const w = await fetch("http://localhost:8000/word").then(o => o.text())
            setAnswer(w.toUpperCase())
        }

        newWord()
        
    }, [])
    console.log(letters)

    if (!answer) return <p>Loading</p>

    return (
        <>
            <WordView words={words} liveGuess={liveGuess} />
            {words.length !== 6 && <Keyboard setWords={setWords} setLiveGuess={setLiveGuess} answer={answer} setLetters={setLetters} />}
            {words.length === 6 && answer}
            <GuessedLetters letters={letters} />
        </>
    )
}