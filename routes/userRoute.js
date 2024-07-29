const express = require('express');
const isLogin = require('../middleware/isLogin');
const router = express.Router()
const userModel = require('../modals/user')
//=================== Order Operations ========================

router.post('/placeorder', isLogin, async(req,res)=>{

    const cartData = await userModel.findOne({_id:req.user}).populate('cart.productId')
    let newda = cartData.cart;
    let PriceforItems = 0;
    let totalprice = 0;
    let deliveryfee = 49;
    let packagingfee = 59;

    console.log(newda);

    PriceforItems = newda.reduce((acc , cur)=>{
        return acc + cur.productId.price * cur.quantity;

    },0)

    if (PriceforItems > 499) {
        deliveryfee = 0;
        totalprice = PriceforItems + packagingfee;
    }
    else{
        totalprice = PriceforItems + (deliveryfee + packagingfee);
    }

    let priceData = {
        totalprice,
        PriceforItems,
        deliveryfee,
        packagingfee,
        newda
    }

    console.log(priceData);
    return res.status(200).send({pricedata:priceData})


    

    return res.status(200).send({data: cartData.cart})
})

//=================== Order Operations ========================




//*===================User Details===================================*//

router.put('/edituser' , isLogin , async(req,res)=>{
    try {

        // const {first_name , last_name , mobile , address} = req.body;       

        const user = await userModel.findOneAndUpdate(
            { _id: req.user },
            { $set: req.body },
          );
      
        if(!user)return res.status(401).send({success:false , error:"User Not Found"})            
        return res.status(200).send({success:true , data : user})
        // console.log(user);
    } catch (error) {
        return res.status(500).send({success:false , error:error.message})
    }
})


router.get('/getuser' , isLogin , async(req,res)=>{
    try {
        const user = await userModel.findOne({_id : req.user});
        if(!user)return res.status(401).send({success:false , error:"User Not Found"})
        const userData = {
            first_name:user.first_name,
            last_name:user.last_name,
            email:user.email,
            mobile:user.mobile,
            address:user.address,
        }
        // await user.save();
        return res.status(200).send({success:true , data : userData})
    } catch (error) {
        return res.status(500).send({success:false , error:error.message})
    }
})


//*===================User Details===================================*//








module.exports = router;

