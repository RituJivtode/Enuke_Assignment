const jwt = require("jsonwebtoken");  // Importing jwt because we are decoding token==//
const userModel = require("../models/userModel");// For performing operation on the db.==//
const mongoose = require("mongoose");

// Defining function to validate objectId ==
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const authentication = function (req, res, next) {
    try {
        // accessing token from headers==//
        let token = req.headers["x-user-key"];

        // Checking user token is present==//
        if (!token) {
            return res.status(400).send({ status: false, message: "Token is required..!" });
        }

        // Decoding token that is coming from the request header..=//
        jwt.verify(token, '-EnukeSoftware-', function (err, decoded) {
            if (err)
                return res.status(400).send({ status: false, message: "invalid token " });

            let userLoggedIn = decoded.userId;

            // Inserting userid in request after decoding to make it ease to access==//
            req["userId"] = userLoggedIn;

            // Passing flow to next function//
            next();
        })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const authorization = async function (req, res, next) {

    try {

        let userid = req.params.userId;
       console.log(typeof userid)
      // accessing userid from request==//
        let id = req.userId;
        console.log(typeof id)
        // validating userId==//
        if (!isValidObjectId(userid)) {
            return res.status(400).send({ status: false, message: "Please enter valid userId" })
        }
    

        // Checking user is present or not==//
        let user = await userModel.findOne({ _id: userid });
        if (!user) {
            return res.status(404).send({ status: false, message: "No such user exist" })
        }
    
        // Authorizing user that token userid and param userId is same or not==// 
        if (id != user._id) {
            return res.status(403).send({ status: false, message: "Not authorized..!" });
        }
    
        // passing flow to the next function==//
        next();
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}



module.exports = { authentication, authorization }