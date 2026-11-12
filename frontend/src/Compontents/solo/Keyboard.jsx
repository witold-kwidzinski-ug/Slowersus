import { useEffect, useRef, useState } from "react"
import handleWord from "./handleWord"


export default function Keyboard({setWords, setLiveGuess, answer, setLetters}) {

    const [guess, setGuess] = useState("")

    const [cansubmit, setCansubmit] = useState(false)


    useEffect(() => {

        function handler(e) {


            setGuess(prev => {
                if (e.key === "Enter" && prev.length === 5) {
                    setCansubmit(true)
                    return prev
                }
                if (e.key === "Backspace" && prev.length > 0) {
                    return prev.slice(0, -1)
                }
                if (/^[a-zA-Z]$/.test(e.key) && prev.length < 5) {
                    return prev + e.key.toUpperCase()
                }
                return prev
            })
        }

        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)

    }, [])

    useEffect(() => {
        if (!cansubmit) return
        async function submission() {
            const valid = await fetch(`/api/validate/${guess.toLowerCase()}`).then(o => o.json())
            setCansubmit(false)
            if (!valid.exists) return
                    
            processWord()
            setGuess("")

        }

        submission()
        
    }, [cansubmit])

    useEffect(() => {
        setLiveGuess(guess)
    }, [guess])


    function processWord() {
        const final = handleWord(guess, answer)

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

    }

    return (
        <></>
    )
}