const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  fullname: { type: String, require: true },
  password: { type: String, require: true },
  email: { type: String, require: true },
  phone: { type: String, require: true },
  orders: [{ type: Schema.Types.ObjectId, ref: "Cart" }],
  role: { type: String, default: "User" },
  cart: {
    products: [
      {
        productData: {
          productId: { type: Schema.Types.ObjectId, ref: "Product" },
          category: { type: String, require: true },
          img1: { type: String, require: true },
          img2: { type: String, require: true },
          img3: { type: String, require: true },
          img4: { type: String, require: true },
          long_desc: { type: String, require: true },
          name: { type: String, require: true },
          price: { type: Number, require: true },
          short_desc: { type: String, require: true },
        },
        count: Number,
      },
    ],
    totalPrice: { type: Number, default: 0 },
  },
});
module.exports = mongoose.model("User", userSchema);
