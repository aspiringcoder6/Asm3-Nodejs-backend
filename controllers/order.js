require("dotenv").config();
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const Order = require("../model/Order");
const User = require("../model/User");
const Product = require("../model/Product");
//email transporter
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);
exports.placeOrder = async (req, res, next) => {
  const { to, fullname, phone, address, cart, userId } = req.body;
  const orderTable = `<table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;width:100%;">
  <thead>
  <tr>
  <th>Tên Sản Phẩm</th>
  <th>Hình ảnh</th>
  <th>Giá</th>
  <th>Số lượng</th>
  <th>Thành tiền</th>
  </thead>
  <tbody>${cart.products
    .map((item) => {
      return `<tr>
          <td>${item.productData.name}</td>
          <td><img src=${
            item.productData.img1
          } style="width:100px;height:auto"/></td>
          <td>${item.productData.price}</td>
          <td>${item.count}</td>
          <td>${item.count * item.productData.price}</td>
          </tr>`;
    })
    .join("")}
    </tbody>
    </table>`;

  const htmlContent = `<h1>Xin chào ${fullname}</h1>
    <p>Phone: ${phone}</p>
    <p>Address: ${address}</p>
    ${orderTable}
    <h1>Tổng thanh toán:</h1>
    <h1>${cart.totalPrice}</h1>
    <h1>Cảm ơn bạn!</h1>`;

  const mailOptions = {
    from: "hieunmfx22241@funix.edu.vn",
    to: [to],
    subject: "Order information",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    const newOrder = new Order({
      user: userId,
      products: cart.products,
      totalPrice: cart.totalPrice,
      name: fullname,
      phone: phone,
      address: address,
      delivery: false,
      status: false,
    });
    await newOrder.save();

    for (let item of cart.products) {
      const product = await Product.findById(item.productData.productId);
      if (product) {
        product.stock -= item.count;
        await product.save();
      }
    }

    // Reset cart
    const user = await User.findById(userId);
    if (user) {
      user.cart = {};
      await user.save();
    }

    res.status(200).json({
      message: "Order placed, stock updated, and mail sent successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
};
//get user orders
exports.getUserHistory = (req, res, next) => {
  const userId = req.query.id;
  Order.find({ user: userId })
    .then((orders) => {
      return res.json({ orders: orders });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Internal server errors" });
    });
};
//get order by id
exports.getOrderById = (req, res, next) => {
  const orderId = req.query.id;
  Order.findById(orderId)
    .then((order) => {
      return res.json({ order: order });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Internal server errors" });
    });
};
//get admin history
exports.getHistory = async (req, res, next) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({ orders: orders });
  } catch (err) {
    return res.status(500).json({ message: "Internal server errors" });
  }
};
