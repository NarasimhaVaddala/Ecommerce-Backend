const express = require('express');
const isLogin = require('../middleware/isLogin');
const router = express.Router()
const userModel = require('../modals/user')
//=================== Order Operations ========================

router.post('/order', isLogin, async (req, res) => {
    try {
      // Fetch user data
      const user = await userModel.findOne({ _id: req.user }).populate('cart.productId');
      if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
      }
  
      // Get cart data and calculate price
      let cartData = user.cart;
      let price = calculatePrice(cartData);
      let address = user.address;
      let status = "pending";
  
      // Create new order
      let newOrder = {
        items: cartData.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          size: item.size
        })),
        status: status
      };
  
      // Add new order to user's orders
      user.orders.push(newOrder);
  
      // Clear the cart
      user.cart = [];
  
      // Save user data
      await user.save();
  
      return res.status(200).send({ success: true, data: { price, orders: user.orders } });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: "Internal Server Error" });
    }
  });



router.get('/order', isLogin, async (req, res) => {
    try {
      // Fetch user data and populate order items
      const user = await userModel.findOne({ _id: req.user }).populate('orders.items.productId');
      if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
      }
  
      return res.status(200).send({ success: true, data: user.orders });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: "Internal Server Error" });
    }
  });

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





function calculatePrice(arr) {
    if (!arr) {
      return;
    } else {
      
      // console.log("arr" , arr);
      
      
      const priceForItems = arr.reduce((acc, item) => {
        
        return acc + (item.productId.price * item.quantity)}, 0);
  
      let totalPrice = 0;
      let packagingFee = 59;
      let deliveryCharges = 0;
  
      if (priceForItems >= 499) {
        deliveryCharges = 0;
        totalPrice = priceForItems + packagingFee + deliveryCharges;
        // console.log(totalPrice, priceForItems, packagingFee, deliveryCharges);
        return { totalPrice, priceForItems, packagingFee, deliveryCharges };
      } else {
        deliveryCharges = 49;
        totalPrice = priceForItems + packagingFee + deliveryCharges;
        // console.log(totalPrice, priceForItems, packagingFee, deliveryCharges);
        return { totalPrice, priceForItems, packagingFee, deliveryCharges };
      }
    }
  }
  


module.exports = router;

