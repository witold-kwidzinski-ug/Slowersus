const express = require("express")
const http = require("http")
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const { v4 } = require("uuid")
const jwt = require("jsonwebtoken")

require("dotenv").config()


const DB = require("./db.js")



const app = express()
const server = http.createServer(app)

app.use([express.json(), cors()])


const filePath = path.join(__dirname, "words.json")

const words = JSON.parse(fs.readFileSync(filePath)).words


function authenticate(req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) return res.sendStatus(401);

    try {
        const public_key = `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLIC_KEY}\n-----END PUBLIC KEY-----`

        const decoded = jwt.verify(token, public_key, {algorithms: ["RS256"]})
        req.decoded = decoded
        next()
    } catch (err) {
        console.log(err)
        res.sendStatus(401)
    }
}

function isAdmin(req, res, next) {
    const roles = req.decoded.realm_access.roles || [];
    if (roles.includes("ADMIN")) {
        next()
    } else {
        res.sendStatus(401)
    }
}




app.get("/api", (req, res) => {
    console.log("super!")
    res.send("Basic route.")
})

app.get("/api/word", (req, res) => {
    res.send(words[Math.floor(Math.random() * words.length)])
})

app.get("/api/validate/:word", (req, res) => {
    const w = req.params.word
    if (words.includes(w)) {
        res.json({exists: true})
    } else {
        res.json({exists: false})
    }
})



//==============================ACCOUNTS==================================

app.get("/api/accounts", async (req, res) => {
    const name = req.query["search-name"]

    const accs = await DB.query(`SELECT * FROM users`)

    if (name) {
        res.send(accs.rows.filter(n => n.name.toLowerCase().includes(name.toLowerCase())))
    } else {
        res.send(accs.rows)
    }

    
})

app.get("/api/user/:id", async (req, res) => {
    const id = req.params.id
    
    const accs = await DB.query(`SELECT * FROM users`)

    const acc = accs.rows.find(n => n.id === id)

    if (acc) {
        res.send(acc)
    } else {
        res.send(`No user with id ${id} found.`)
    }

})

// app.delete("/user/:id", (req, res) => {
//     const id = req.params.id
//     const acc = accounts.findIndex(n => n.id === id)

//     if (acc) {
//         accounts.splice(id, 0)
//         res.send("User successfully deleted.")
//     } else {
//         res.send(`No user with id ${id} found.`)
//     }

// })

// app.put("/result/:id", (req, res) => {
//     const id = req.params.id
//     const stats = req.body

//     const acc = accounts.find(n => n.id === id)

//     if (stats.result === "win") {
//         acc.wins++
//         acc.points += (7 - stats.wordamount)
//     } else {
//         acc.losses++
//         acc.points -= (7 - stats.enemywordamount)
//         if (acc.points < 0) acc.points = 0
//     }

//     res.send("User score changed.")


// })


app.post("/api/account_sync", authenticate, async (req, res) => {
    try {     

        const sub = req.decoded.sub
        const name = req.decoded.preferred_username


        const acc = await DB.query(`SELECT * FROM users WHERE id = $1;`, [sub])


        if (acc.rows.length === 0) {
            const insert = await DB.query(`INSERT INTO USERS (id, name, bio, points, wins, losses, streak) VALUES ($1, $2, '', 0.0, 0, 0, 0) RETURNING *;`, [sub, name])

            return res.status(201).json(insert.rows[0]);
        }

        res.json(acc.rows[0])

    } catch (err) {
        console.error(err)
        res.status(500).json({message: "There was an error while acquiring the profile."})
    }


})

//================================RANKING==================================

app.get("/api/ranking", async (req, res) => {
    const top = Number(req.query["top"])

    try {
        const rankings = await DB.query(`SELECT * FROM users ORDER BY points LIMIT $1;`, [top])

        const blacklisted_ids = await DB.query(`SELECT * FROM blacklisted_ids;`)

        const r = rankings.rows.filter(n => !blacklisted_ids.rows.includes(n.id)).sort((a,b) => b.points - a.points)

        if (!isNaN(top) && top > 0) {
            res.json(r)
        } else {
            res.json(rankings.rows)
        }
    
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "There was an error while acquiring rankings."})
    }
})

app.delete("/ranking/:id", authenticate, isAdmin, async (req, res) => {
    const id = req.params.id

    await DB.query(`DELETE * FROM users WHERE id=$1`, [id])

    res.json({message: "User has been unbanned from ranking."})
})

app.post("/ranking/:id", authenticate, isAdmin, async (req, res) => {
    const id = req.params.id

    await DB.query(`INSERT INTO users (id) VALUES ($1)`, [id])

    res.json({message: "User successfully banned from ranking."})

})



//================================GAMES====================================

let games = []

app.post("/api/games", (req, res) => {

    const gameid = v4()


    res.send(gameid)

})

app.get("/api/games", (req, res) => {
    res.json(games)
})




const {Server} = require("socket.io")
const gameSocket = require("./gameSocket.js")

const io = new Server(server, {cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }})

gameSocket(io, words, games)


server.listen(3000, () => console.log("Started express server at http://localhost:3000/"))