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




const accounts = [
    {id: 14, name: "user1", password: "supcio"},
    {
    id: "52e0ebae-6704-4f5d-bf18-be70e00c2925",
    name: "siema",
    password: "$2b$10$fgE48d./L50z9TY6dIuSTO5vxJL3qE5DmexZZSXCNaNpuvSuahqOy"
  }
]

app.get("/accounts", (req, res) => {
    res.send(accounts)
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

    const newacc = {id: uuidv4(), name: name, password: pass}

    accounts.push(newacc)

    res.json(newacc)
})




const games = []

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