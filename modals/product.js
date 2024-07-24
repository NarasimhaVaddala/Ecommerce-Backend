const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  brand: { type: String, required: true },
  image: { type: String, required: true },
  gender: { type: String, required: true },
  color: { type: String, required: true },
  size: {
    type: Object,
    default: { S: 10, M: 10, L: 10, XL: 10, XXL: 10 },
  },
});

module.exports = new mongoose.model("product", productSchema);
