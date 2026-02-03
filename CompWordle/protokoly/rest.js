import express from "express"
import http from "http"
import cors from "cors"
import fs from "fs"
import { v4 as uuidv4, v4 } from "uuid"

import dotenv from "dotenv"
dotenv.config()

const h = Number(process.env.HASH)

import bcrypt from "bcrypt"




const app = express()
const server = http.createServer(app)


app.use([express.json(), cors()])

const words = JSON.parse(fs.readFileSync("protokoly/words.json")).words


app.get("/", (req, res) => {
    console.log("super!")
    res.send("Basic route.")
})

app.get("/word", (req, res) => {
    res.send(words[Math.floor(Math.random() * words.length)])
})

app.get("/validate/:word", (req, res) => {
    const w = req.params.word
    if (words.includes(w)) {
        res.json({exists: true})
    } else {
        res.json({exists: false})
    }
})




let accounts = [
    {id: "14", name: "user1", password: "supcio", bio: "a", role: "user", points: 0.0, wins: 8, losses: 12},
    {
    id: "52e0ebae-6704-4f5d-bf18-be70e00c2925",
    name: "siema",
    password: "$2b$10$fgE48d./L50z9TY6dIuSTO5vxJL3qE5DmexZZSXCNaNpuvSuahqOy",
    bio: "jestem super",
    role: "admin",
    points: 0.0,
    wins: 17,
    losses: 3
  }
]

const adminperms = ["52e0ebae-6704-4f5d-bf18-be70e00c2925"]

//==============================ACCOUNTS==================================

app.get("/accounts", (req, res) => {
    const name = req.query["search-name"]

    const accs = accounts.map(({password, ...n}) => n)

    if (name) {
        res.send(accs.filter(n => n.name.toLowerCase().includes(name.toLowerCase())))
    } else {
        res.send(accs)
    }

    
})

app.get("/user/:id", (req, res) => {
    const id = req.params.id
    const acc = accounts.find(n => n.id === id)

    if (acc) {
        const {password, ...acc2} = acc
        res.send(acc2)
    } else {
        res.send(`No user with id ${id} found.`)
    }

})

app.delete("/user/:id", (req, res) => {
    const id = req.params.id
    const acc = accounts.findIndex(n => n.id === id)

    if (acc) {
        accounts.splice(id, 0)
        res.send("User successfully deleted.")
    } else {
        res.send(`No user with id ${id} found.`)
    }

})

app.put("/result/:id", (req, res) => {
    const id = req.params.id
    const stats = req.body

    const acc = accounts.find(n => n.id === id)

    if (stats.result === "win") {
        acc.wins++
        acc.points += (7 - stats.wordamount)
    } else {
        acc.losses++
        acc.points -= (7 - stats.enemywordamount)
        if (acc.points < 0) acc.points = 0
    }

    res.send("User score changed.")


})

app.post("/validate_admin/:id", (req, res) => {
    const id = req.params.id

    if (adminperms.includes(id)) {
        res.send("Valid")
    } else {
        res.send("Invalid.")
    }

})


app.post("/login", async (req, res) => {
    const {name, password} = req.body

    console.log(`${name}, ${password}`)

    const acc = accounts.find(n => n.name === req.body.name)


    if (!acc) {
        res.json({error: "Wrong name."})
        return
    }

    const pass = await bcrypt.compare(password, acc.password)

    if (!pass) {
        res.json({error: "Wrong password."})
        return
    }

    res.json(acc)



})

app.post("/register", async (req, res) => {

    const {name, password} = req.body

    console.log(`${name}, ${password}`)

    if (accounts.find(n => n.name === name)) {
        res.json({error: "Name already taken."})
        return
    }

    const pass = await bcrypt.hash(password, h)

    const newacc = {id: uuidv4(), name: name, password: pass, bio: "", role: "user", points: 0.0, wins: 0, losses: 0}

    accounts.push(newacc)

    res.json(newacc)
})

//================================RANKING==================================

const blacklisted_ids = []

app.get("/ranking", (req, res) => {
    const top = Number(req.query["top"])

    const r = accounts.filter(n => !blacklisted_ids.includes(n.id)).sort((a,b) => b.points - a.points)

    if (!isNaN(top) && top > 0) {
        res.send(r.slice(0,top))
    } else {
        res.send(r)
    }
    
})

app.delete("/ranking/:id", (req, res) => {
    const id = req.params.id

    blacklisted_ids.push(id)

    res.send("User successfully banned from ranking.")
})

app.post("/ranking/:id", (req, res) => {
    const id = req.params.id

    const bl_index = blacklisted_ids.findIndex(n => n.id === id)

    blacklisted_ids.splice(bl_index, 1)

    res.send("User successfully put in ranking.")

})



//================================GAMES====================================

let games = []

app.post("/games", (req, res) => {

    const gameid = v4()


    res.send(gameid)

})

app.get("/games", (req, res) => {
    res.json(games)
})





import {Server} from "socket.io"
import gameSocket from "./gameSocket.js"

const io = new Server(server, {cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }})

gameSocket(io, words, games)


server.listen(8000, () => console.log("Started express server at http://localhost:8000/"))