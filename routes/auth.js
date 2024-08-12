const express = require("express");
const { check } = require("express-validator");
const User = require("../model/User");
const authController = require("../controllers/auth");
const router = express.Router();
//get Number of clients
router.get("/getClients", authController.getClients);
//get user from session
router.get("/session", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not login" });
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Internal server errors" });
    });
});
router.post(
  "/signup",
  [
    check("email").custom((value) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("This email has already exist");
        }
      });
    }),
    check("phone").isMobilePhone().withMessage("Invalid phone number"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be longer than 8 characters"),
  ],
  authController.postSignUp
);
router.post(
  "/signin",
  [
    check("email").custom((value) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (!userDoc) {
          return Promise.reject("This email doesn't exist, sign up!");
        }
      });
    }),
  ],
  authController.postLogin
);
router.post("/adminLogin", authController.adminLogin);
router.post("/logout", authController.postLogout);
module.exports = router;
