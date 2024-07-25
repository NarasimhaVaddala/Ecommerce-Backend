const express = require('express')
const db = require('./db')
const app = express()
const cors = require('cors')
const path = require('path')

const product = require('./modals/product')

app.use(cors())
app.use(express.json())


app.get('/' , (req,res)=>{
    return res.send("<h1>Hello</h1>")
})

app.use('/products' , require('./routes/productsRoute'))
app.use('/auth' , require('./routes/Auth'))


app.listen(3000 , ()=>{
    console.log("http://localhost:3000/");
})

