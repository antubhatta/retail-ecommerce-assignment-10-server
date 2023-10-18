const express = require('express')
require('dotenv').config()

const app = express()
const cors= require('cors')
const port=process.env.PORT || 3000

// middleware
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('retail-e-commerce client server')
})
app.listen(port,(req,res)=>{
    console.log(`retail-e-commerce client: ${port}`)
})