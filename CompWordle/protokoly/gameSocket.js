
export default function gameSocket(io) {
    io.on("connection", (socket) => {

        socket.on("join_game", (gameid) => {
            socket.join(gameid)
            io.to(gameid).emit("message")
        })
        console.log("connected on backend")
    })
    
}