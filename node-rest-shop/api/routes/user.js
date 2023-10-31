const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const Auth = require('../middleWares/auth')

const User = require("../models/user");
const userController = require("../controllers/user")

router.post("/signup", userController.user_signup)

router.post("/login",  userController.user_login)

router.delete("/:userId", Auth, userController.user_delete)

module.exports = router;
