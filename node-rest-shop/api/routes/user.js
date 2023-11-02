const express = require("express");
const router = express.Router();
const Auth = require('../middleWares/auth');
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const mongoose = require("mongoose");

const userController = require("../controllers/user")

router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user.length >= 1) {
          res.status(409).json({
            Error: "User already exists with Same Email",
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({ Error: err });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
              });
              user
                .save()
                .then((result) => {
                  console.log(result);
                  res.status(201).json({
                    Message: "user Created Successfully",
                  });
                })
                .catch((err) => {
                  console.log(err),
                    res.status(500).json({
                      Message: "User Creation Faile",
                    //   Error: err,
                    });
                });
            }
          });
        }
      });
  });

router.post("/login",  userController.user_login)

router.delete("/:userId", Auth, userController.user_delete)

module.exports = router;
