
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const User = require("../models/user");


module.exports.user_signup = (req, res, next) => {
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
                      Message: "User Creation Failed",
                      Error: err,
                    });
                });
            }
          });
        }
      });
  };

  module.exports.user_login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user.length < 1) {
          res.status(401).json({
            Message: " Auth Failed",
          });
        } else {
          bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
              res.status(401).json({
                Message: " Auth Failed",
              });
            }
            if (result) {
  
              const Token = jwt.sign({
                  email : user.email,
                  _id : user._id
              },
               "Secret",
               {
                  expiresIn : "22h"
               })
  
  
              return res.status(200).json({
                Token : Token,
                Message: "Auth Successfull",
              });
            } else {
              res.status(401).json({
                Message: " Auth Failed",
              });
            }
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          Message: "Error Occured",
          Error: err, // Return the actual error object
        });
      });
  };

  module.exports.user_delete = (req, res, next) => {
    User.findByIdAndDelete({ _id: req.params.userId })
      .exec()
      .then((result) => {
        res.status(200).json({
          Message: "User Deleted",
        });
      })
      .catch((err) => {
        res.status(500).json({
          Message: "User Could Not Be Deleted",
          Error: err, // Return the actual error object
        });
      });
  };
  