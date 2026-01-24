import express from "express"
import cors from "cors"
import fs from "fs"

const app = express()

app.use([express.json(), cors()])

const words = JSON.parse(fs.readFileSync("protokoly/words.json")).words


app.get("/", (req, res) => {
    console.log("super!")
    res.send("Basic route.")
})

app.get("/word", (req, res) => {
    res.send(words[Math.floor(Math.random() * words.length)])
})


app.listen(8000, () => console.log("Started express server at http://localhost:8000/"))