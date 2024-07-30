const mongoose = require('mongoose');

// Cart Item Schema
const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
});

// Wish Item Schema
const WishItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
});

// Order Item Schema
const OrderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
});

// Order Schema
const OrderSchema = new mongoose.Schema({
    items: { type: [OrderItemSchema], required: true },
    status: { type: String, default: "pending" }
});

// Address Schema
const AddressSchema = new mongoose.Schema({
    pincode: { type: String, default: "" },
    name: { type: String, default: "" },
    mobile: { type: String, default: "" },
    addr: { type: String, default: "" }
});

// User Schema
const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: AddressSchema,
        default: () => ({})
    },
    cart: [CartItemSchema],
    wishlist: [WishItemSchema],
    orders: [OrderSchema]
});

module.exports = mongoose.model("User", UserSchema);
