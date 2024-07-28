const mongoose = require('mongoose')


// let url = "mongodb+srv://narasimha:narasimha@cluster1.ktyz1yg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"

let url = "mongodb://localhost:27017/ecommerce"

mongoose.connect(url).then(()=>console.log("Connected to Db")).catch((err)=>{console.log(err.message)})


module.exports = mongoose;