const mongoose = require('mongoose')




const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
  });

const WishItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
})  

const addressSchema = new mongoose.Schema({
    pincode:{
        type:String,
        required:true
    },
    addr:{
        type:String,
        required:true
    }

    
})


const userSchema = mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:[addressSchema],
        default:{}
    },
    cart: [CartItemSchema],
    wishlist:[WishItemSchema]
})






module.exports = new mongoose.model("user", userSchema);
