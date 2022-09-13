const express = require("express")
const router = express.Router()
const userController = require("../Controllers/userController")
const imageController =require("../Controllers/imageController")
const mid = require("../middleware/Auth")

// For register User...
router.post("/users", userController.registration)

// For login User...
router.post("/login", userController.login)

// For uploading images...
router.post("/uploadimage/:userId", mid.authentication, mid.authorization, imageController.uploadimage)

module.exports=router;