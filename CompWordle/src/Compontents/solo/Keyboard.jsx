import { useEffect, useRef, useState } from "react"


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
            console.log("hi")
            const valid = await fetch(`http://localhost:8000/validate/${guess.toLowerCase()}`).then(o => o.json())
            setCansubmit(false)
            console.log(valid)
            if (!valid.exists) return
                    
            handleWord(guess)
            setGuess("")

        }

        submission()
        
    }, [cansubmit])

    useEffect(() => {
        setLiveGuess(guess)
    }, [guess])

    function handleWord(word) {
        const final = Array(5).fill(null)

        const answerobj = [...answer].reduce((acc, el) => {
            if (!acc[el]) {
                return {...acc, [el]: 1}
            }
            return {...acc, [el]: acc[el] + 1}

        }, {})

        for (let i = 0; i < 5; i++) {
            const letter = word[i]
            if (letter === answer[i]) {
                final[i] = {letter, color: "lime"}
                answerobj[letter]--
            }
        }

        for (let i = 0; i < 5; i++) {
            const letter = word[i]
            if (final[i]) continue

            if ([...answer].includes(letter) && answerobj[letter] > 0) {
                final[i] = {letter, color: "gold"}
                answerobj[letter]--
                continue
            }

            final[i] = {letter, color: "gray"}

        }

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