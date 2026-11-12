"use client"

import { useEffect, useState } from "react"
import Keyboard from "../Compontents/solo/Keyboard"
import WordView from "../Compontents/solo/WordView"
import "./solo.css"

import { defaultLetters } from "./defaultLetters"
import GuessedLetters from "../Compontents/solo/GuessedLetters"
import WinModal from "../Compontents/solo/WinModal"

export default function Solo() {

    const [answer, setAnswer] = useState(null)
    const [words, setWords] = useState([])
    const [letters, setLetters] = useState(defaultLetters)
    const [liveGuess, setLiveGuess] = useState([])

    async function newWord() {
        const w = await fetch("/api/word").then(o => o.text())
        setAnswer(w.toUpperCase())
    }

    useEffect(() => {
        newWord()
    }, [])

    if (!answer) return <p>Loading</p>

    function isGuessed() {
        return words.length !== 0 && words[words.length-1].reduce((acc, el) => el.color === "lime" ? acc + 1 : acc, 0) === 5
    }
    console.log(isGuessed())
    console.log(answer)

    return (
        <>
            {(words.length === 6 || isGuessed()) && <WinModal isWon={isGuessed()} answer={answer} guesses={words.length} />}
            <WordView words={words} liveGuess={liveGuess} isGuessed={isGuessed()} />
            {words.length !== 6 && !isGuessed() && <Keyboard setWords={setWords} setLiveGuess={setLiveGuess} answer={answer} setLetters={setLetters} />}
            {words.length === 6 && !isGuessed() && answer}
            <GuessedLetters letters={letters} />
        </>
    )
}