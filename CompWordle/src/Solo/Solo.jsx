"use client"

import { useState } from "react"
import Keyboard from "../Compontents/Keyboard"
import WordView from "../Compontents/WordView"
import "./solo.css"

export default function Solo() {

    const [words, setWords] = useState([])
    const [liveGuess, setLiveGuess] = useState([])

    return (
        <>
            <WordView words={words} liveGuess={liveGuess} />
            <Keyboard setWords={setWords} setLiveGuess={setLiveGuess} />
            <p>Guesses: {words.length}/6</p>
        </>
    )
}