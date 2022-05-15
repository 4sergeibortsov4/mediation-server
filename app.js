
//////////////////////////////////////
const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')
//////////////////////////////////////


const PORT = process.env.PORT
const app = express()

app.use(cors())
app.use(express.json({extended: true}))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/appeals', require('./routes/appeals.routes'))
app.use('/api/user', require('./routes/user.routes'))

async function start() {
    try {
        await mongoose.connect(process.env.MONGOURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, IP = () => {
            console.log(`App has been started in ${PORT} port...`)
        })
    } catch (e) {
        console.log('Server error: ', e.message)
        process.exit(1)
    }
}

start()

