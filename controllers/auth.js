const User = require("../model/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
exports.getClients = async (req, res, next) => {
  try {
    const clients = await User.find({ role: "User" });
    return res.status(200).json({ clientNum: clients.length });
  } catch (err) {
    return res.status(500).json({ message: "Internal server errors" });
  }
};
exports.postSignUp = (req, res, next) => {
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({
      errors: errors.array(),
    });
  }
  return bcrypt
    .hash(password, 12)
    .then((hashedPass) => {
      const user = new User({
        fullname,
        email,
        password: hashedPass,
        phone,
        orders: [],
      });
      res.status(201).json({ message: "Sign up successful" });
      return user.save();
    })
    .catch((err) => {
      res.status(500).json({ errors: [{ msg: err }] });
    });
};
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }
  User.findOne({ email: email }).then((user) => {
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          req.session.user = user;
          req.session.isLoggedIn = true;
          req.session.save((err) => {
            if (err) {
              return res.status(500).json({ message: "Server errors" });
            }
            return res.status(200).json({ user: user });
          });
        } else {
          return res.status(401).json({ errors: [{ path: "password" }] });
        }
      })
      .catch((err) => {
        return res.status(500).json({ message: "Server errors" });
      });
  });
};
exports.adminLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email, role: { $in: ["Admin", "Consultant"] } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "No email found!" });
      }
      return bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.user = user;
          req.session.isLoggedIn = true;
          req.session.save((err) => {
            if (err) {
              return res.status(500).json({ message: "Server errors" });
            }
            return res.status(200).json({ user: user });
          });
        } else {
          return res.status(401).json({ messages: "Password invalid!" });
        }
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Server errors" });
    });
};
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
  });
  //xóa cookie
  res.clearCookie("connect.sid", {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Log out successful!" });
};
