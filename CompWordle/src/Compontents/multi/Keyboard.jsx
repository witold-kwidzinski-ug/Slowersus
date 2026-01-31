import { useEffect, useRef, useState } from "react"


export default function Keyboard({setWords, setLiveGuess, setLetters, socket}) {

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
        socket.emit("guess", guess)
        
    }, [cansubmit])

    useEffect(() => {
        setLiveGuess(guess)
    }, [guess])

    // do dokonczenia dodawanie liter nastepnym razem
    function handleWord(word) {
  
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

    }

    return (
        <></>
    )
}