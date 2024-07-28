const express = require('express')
const router = express.Router()
const userModel = require('../modals/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const secret = "@20211067766515042001@Amdr53600"


const genHash = (password)=>{

    try {
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(password, salt)
        return hash;
    } catch (error) {
        throw new Error(error.message)
    }
 
}

const genToken = (id)=>{
    try {
        if(!id)throw new Error("Id Not found")
        const token = jwt.sign({id:id}, secret)
        return token;
    } catch (error) {
        
        throw new Error(error.message)
    }
}


const verifyPassword = (password, hash)=>{
    try {
        if (!password || !hash)throw new Error("Please provide password")
        if(password && hash){
            const verified = bcrypt.compareSync(password ,hash)
            return verified
        }
    } catch (error) {
        throw new Error(error.message)
    }
}




router.post('/signup' , async(req,res)=>{
    try {
        const data = await userModel.findOne({$or:[ {email : req.body.email}, {mobile:req.body.mobile} ]})
        if(data)return res.status(409).send({success:false , error:"User already exists" })
            
            req.body.password = genHash(req.body.password)
            const user = await userModel.create(req.body)
            if(user){
                const token = genToken(user._id)
                return res.status(200).send({success:true , token:token})
            }
            else{
                throw new Error("Something went wrong Please try again Later")
            }       
            
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false , error:error.message, code:error.code})
    }
})

router.post('/login' , async(req,res)=>{
    try {

        const {userid, password} = req.body;
        console.log(req.body);
        const user = await userModel.findOne({$or:[ {email : userid}, {mobile:userid} ]})

        if (!user) {
            return res.status(409).send({success:false, error:"Incorrect Credentials"})
        }

        if (user) {
            let verify = verifyPassword(password , user.password)
            if (!verify) {
                return res.status(401).send({success:false , error:"Incorrect Credentials"})
            }
            let token = genToken(user._id)
            return res.status(200).send({success:true , token:token , user:user})

        }
        
    } catch (error) {
        return res.status(500).send({success:false , error:error.message, code:error.code})
        
    }
})




module.exports = router  