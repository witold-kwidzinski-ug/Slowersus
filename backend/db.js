require('dotenv').config()
const {Pool} = require('pg')
const fs = require('fs')


const DB = new Pool({
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

module.exports = DB