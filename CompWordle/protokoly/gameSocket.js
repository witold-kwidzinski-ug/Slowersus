
export default function gameSocket(io, words, games) {
    io.on("connection", (socket) => {

        socket.on("join_game", ({gameid, pid}) => {
            console.log(`${gameid}, ${pid}`)
            socket.join(gameid)
            socket.pid = pid
            socket.gameid = gameid
            const gameinfo = games.find(n => n.gameid === gameid)
            if (!gameinfo) {
                const g = {
                    gameid: gameid,
                    p1: {
                        id: pid,
                        guesses: []
                    },
                    p2: {
                        id: null,
                        guesses: []
                    },
                    answer: words[Math.floor(Math.random() * words.length)].toUpperCase()
                }
                games.push(g)
                console.log("p1")
                socket.emit("game_joined", g)
            } else {
                console.log("p2")
                
                if (!gameinfo.p2.id && pid !== gameinfo.p1.id) {
                    gameinfo.p2.id = pid
                }

                console.log(gameinfo.p2.id)

                io.to(gameid).emit("game_joined", gameinfo)
            }
        })

        socket.on("start_game", () => {
            const gameinfo = games.find(n => n.gameid === socket.gameid)
            if (!gameinfo) return
            if (!gameinfo.p1.id || !gameinfo.p2.id) return
            io.to(socket.gameid).emit("start_game")
        })

        socket.on("guess", (word) => {
            console.log(`${socket.pid}: ${word}`)
            if (!words.includes(word.toLowerCase())) return
            const gameinfo = games.find(n => n.gameid === socket.gameid)
            
            if (!gameinfo) return

            const final = Array(5).fill(null)

            const answerobj = [...gameinfo.answer].reduce((acc, el) => {
                if (!acc[el]) {
                    return {...acc, [el]: 1}
                }
                return {...acc, [el]: acc[el] + 1}

            }, {})

            for (let i = 0; i < 5; i++) {
                const letter = word[i]
                if (letter === gameinfo.answer[i]) {
                    final[i] = {letter, color: "lime"}
                    answerobj[letter]--
                }
            }

            for (let i = 0; i < 5; i++) {
                const letter = word[i]
                if (final[i]) continue

                if ([...gameinfo.answer].includes(letter) && answerobj[letter] > 0) {
                    final[i] = {letter, color: "gold"}
                    answerobj[letter]--
                    continue
                }

                final[i] = {letter, color: "gray"}


            }

            gameinfo.p1.id === socket.pid ? gameinfo.p1.guesses.push(final) : gameinfo.p2.guesses.push(final)

            
            io.to(socket.gameid).emit("newguess", {pid: socket.pid, final: final})



        })

        socket.on("disconnect", () => {

        })

        console.log("connected on backend")
    })
    
}