const DB = require("./db")

const disconnectTimers = new Map()
const activeSockets = new Map()


function gameSocket(io, words, games) {
    io.on("connection", (socket) => {
        const pid = socket.user.sub

        socket.on("join_game", ({gameid}) => {
            if (!gameid) {
                socket.emit("join_failed", {message: "Invalid game ID"})
                return
            }

            const gameinfo = games.get(gameid)



            if (gameinfo && (pid === gameinfo.p1.id || pid === gameinfo.p2.id)) {
                const timer = disconnectTimers.get(`${gameid}:${pid}`)

                if (timer) {
                    clearTimeout(timer)
                    disconnectTimers.delete(`${gameid}:${pid}`)
                }
            }

            

            if (gameinfo && pid !== gameinfo.p1.id && pid !== gameinfo.p2.id && gameinfo.status !== "waiting") {
                socket.emit("join_failed", {message: "Game is currently happening"})
                return
            }



            
            if (!gameinfo) {
                const g = {
                    p1: {
                        id: pid,
                        guesses: []
                    },
                    p2: {
                        id: null,
                        guesses: []
                    },
                    answer: words[Math.floor(Math.random() * words.length)].toUpperCase(),
                    status: "waiting"
                }
                games.set(gameid, g)
                socket.data.pid = pid
                socket.data.gameid = gameid

                activeSockets.set(`${gameid}:${pid}`, socket.id)

                socket.join(gameid)
                socket.emit("game_joined", g)
                return
            }
            if (pid === gameinfo.p1.id || pid === gameinfo.p2.id) {
                socket.data.pid = pid
                socket.data.gameid = gameid

                activeSockets.set(`${gameid}:${pid}`, socket.id)

                socket.join(gameid)
                socket.emit("game_joined", gameinfo)
                return
            }

            if (!gameinfo.p2.id && pid !== gameinfo.p1.id) {
                gameinfo.p2.id = pid
                socket.data.pid = pid
                socket.data.gameid = gameid

                activeSockets.set(`${gameid}:${pid}`, socket.id)

                socket.join(gameid)
                io.to(gameid).emit("game_joined", gameinfo)
                return
            }

            socket.emit("join_failed", {message: "Game is full"})

            
        })

        socket.on("start_game", () => {
            const gameinfo = games.get(socket.data.gameid)

            if (!gameinfo) return
            if (socket.data.pid !== gameinfo.p1.id) return
            if (gameinfo.status !== "waiting") return
            if (!gameinfo.p2.id) return
            if (activeSockets.get(`${socket.data.gameid}:${gameinfo.p1.id}`) !== socket.id) return
            if (!activeSockets.has(`${socket.data.gameid}:${gameinfo.p2.id}`)) return

            gameinfo.answer = words[Math.floor(Math.random() * words.length)].toUpperCase()
            gameinfo.status = "active"

            io.to(socket.data.gameid).emit("start_game")
        })

        socket.on("guess", async (word) => {
            if (typeof word !== "string" || word.length !== 5 || !words.includes(word.toLowerCase())) {
                socket.emit("word_failed")
                return
            }

            const gameinfo = games.get(socket.data.gameid)

            
            if (!gameinfo || gameinfo.status !== "active") {
                socket.emit("word_failed")
                return
            }
            
            const key = `${socket.data.gameid}:${socket.data.pid}`

            if (activeSockets.get(key) !== socket.id) {
                socket.emit("word_failed")
                return
            }


            if (socket.data.pid !== gameinfo.p1.id && socket.data.pid !== gameinfo.p2.id) {
                socket.emit("word_failed")
                return
            }

            const player = socket.data.pid === gameinfo.p1.id ? gameinfo.p1 : gameinfo.p2
            const enemy = socket.data.pid === gameinfo.p1.id ? gameinfo.p2 : gameinfo.p1


            if (player.guesses.length >= 6) {
                socket.emit("word_failed")
                return
            }

            if (word === gameinfo.answer) {
                gameinfo.status = "finishing"

                io.to(socket.data.gameid).emit("newguess", {pid: socket.data.pid, final: [...word].map(letter => ({letter, color: "lime"}))})
                io.to(socket.data.gameid).emit("win", {pid: socket.data.pid, answer: gameinfo.answer})

                await DB.query(`UPDATE users SET points = points + $1, wins = wins + 1, streak = streak + 1 WHERE id = $2;`, [6 - player.guesses.length, player.id])
                await DB.query(`UPDATE users SET points = points - $1, losses = losses + 1, streak = 0 WHERE id = $2;`, [6 - enemy.guesses.length, enemy.id])
                
                gameinfo.p1.guesses = []
                gameinfo.p2.guesses = []

                gameinfo.status = "waiting"

                return
            }

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

            player.guesses.push(final)
            
            if (gameinfo.p1.guesses.length === 6 && gameinfo.p2.guesses.length === 6) {
                gameinfo.p1.guesses = []
                gameinfo.p2.guesses = []
                gameinfo.status = "waiting"
                io.to(socket.data.gameid).emit("draw", {answer: gameinfo.answer})
                return
            }

            
            io.to(socket.data.gameid).emit("newguess", {pid: socket.data.pid, final: final})



        })

        socket.on("disconnect", () => {
            const gameid = socket.data.gameid
            const gameinfo = games.get(gameid)

            const key = `${gameid}:${socket.data.pid}`

            if (!gameinfo) {
                return
            }
            if (socket.data.pid !== gameinfo.p1.id && socket.data.pid !== gameinfo.p2.id) {
                return
            }

            if (activeSockets.get(key) !== socket.id) {
                return
            }

            activeSockets.delete(key)

            const oldTimer = disconnectTimers.get(key)
            if (oldTimer) {
                clearTimeout(oldTimer)
                disconnectTimers.delete(key)
            } 

            disconnectTimers.set(key, setTimeout(() => {

                const currentGame = games.get(gameid);

                if (!currentGame) {
                    disconnectTimers.delete(key)
                    return
                } 

                if (activeSockets.has(key)) {
                    disconnectTimers.delete(key)
                    return
                }

                games.delete(gameid)

                io.to(gameid).emit("game_cancelled", {message: "A player has left the game"})

                for (const id of [currentGame.p1.id, currentGame.p2.id]) {
                    if (!id) continue;

                    const pKey = `${gameid}:${id}`;
                    const timer = disconnectTimers.get(pKey);

                    if (timer) {
                        clearTimeout(timer)
                    }

                    disconnectTimers.delete(pKey);
                    activeSockets.delete(pKey);
                }
            }, 30000))
        })

        console.log("connected on backend")
    })
    
}

module.exports = gameSocket