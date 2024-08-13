require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");
const multer = require("multer");
const http = require("http");
const app = express();
const server = http.createServer(app);
const fs = require("fs");

const io = require("./socket").init(server);
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirname = path.dirname("images");
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    // Get the original file extension
    const ext = path.extname(file.originalname);
    // Create a unique filename with the original extension
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});
const store = new MongoStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
const authRoute = require("./routes/auth");
const productRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const chatRoute = require("./routes/chatRooms");
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(multer({ storage: fileStorage }).array("images"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    },
  })
);
app.use("/users", authRoute);
app.use("/products", productRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);
app.use("/chat", chatRoute);
io.on("connection", (socket) => {
  console.log("connected");
  socket.on("joinRoom", (roomId) => {
    console.log("Client joined:" + roomId);
    socket.join(roomId);
  });
});
mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    server.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));
