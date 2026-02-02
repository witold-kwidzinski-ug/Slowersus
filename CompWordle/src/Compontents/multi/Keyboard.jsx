import { useEffect, useRef, useState } from "react"
import { useUserInfo } from "../../../contexts/UserInfoContext"


export default function Keyboard({setLiveGuess, socket}) {

    const {state} = useUserInfo()

    const [guess, setGuess] = useState("")

    const canSubmit = useRef(true)



    useEffect(() => {

        function handler(e) {

            if (e.key === "Backspace") {
                setGuess(p => p.length > 0 ? p.slice(0, -1) : p)
                return
            }
            if (/^[a-zA-Z]$/.test(e.key)) {
                setGuess(p => p.length < 5 ? p + e.key.toUpperCase() : p)
                return
            }
            if (e.key === "Enter") {
                if (guess.length === 5 && canSubmit.current) {
                        canSubmit.current = false
                        socket.current.emit("guess", guess)
                    }

                return

            }

        }

        window.addEventListener("keydown", handler)



        return () => {
            window.removeEventListener("keydown", handler)
        }

    }, [guess])

    useEffect(() => {
        if (!socket.current) return

        const fn = ({pid, final}) => {
            if (state.id === pid) {
                setGuess("")
                canSubmit.current = true
            }
        }

        socket.current.on("newguess", fn)

        const fn2 = () => {
            console.log("wrong guess")
            setTimeout(() => {canSubmit.current = true}, 1000)
            
        }

        socket.current.on("word_failed", fn2)

        return () => {
            socket.current.off("newguess", fn)
            socket.current.off("word_failed", fn2)
        }
    }, [socket, state.id])


    useEffect(() => {
        setLiveGuess(guess)
    }, [guess])


    return (
        <></>
    )
}