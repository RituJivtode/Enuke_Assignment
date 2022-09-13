const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt") // For encrypting password




// Using to validate request parameters by calling this function
const isValid = function (value) {
    if (typeof value == undefined || value == null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'Number' && value.toString().trim().length === 0) return false
    return true
}

const registration = async function (req, res) {
    try {
        const body = req.body

        // checking body is empty or not
        if (Object.keys(body).length === 0) {
            return res.status(400).send({ status: false, message: "Body can't be empty" })
        }

        const { fname, lname, email, password } = body; // Object Destructuring

        let regex = /^[a-zA-Z ]*$/
        
        // Email is Mandatory...
        if (!isValid(fname)) {
            return res.status(400).send({ status: false, message: "fname is required" })
        }
        //check whether fname is validate or not
        if (!regex.test(fname)) {
            return res.status(400).send({ status: false, message: "Please enter valid fname" })
        }
       
        // Email is Mandatory...
        if (!isValid(lname)) {
            return res.status(400).send({ status: false, message: "lname is required" })
        }
        //check whether lname is validate or not
        if (!regex.test(lname)) {
            return res.status(400).send({ status: false, message: "Please enter valid lname" })
        }

        // Email is Mandatory...
        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "Email is required" })
        }
        // For a Valid Email...
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(body.email))) {
            return res.status(400).send({ status: false, message: ' Email should be a valid' })
        }

        // Email is Unique...
        let duplicateEmail = await userModel.findOne({ email: body.email })
        if (duplicateEmail) {
            return res.status(400).send({ status: false, msg: 'Email already exist' })
        }

        //password Number is Mandatory...
        if (!isValid(password)) {
            return res.status(400).send({ Status: false, message: " password is required" })
        }
        // password Number is Valid...
        let Passwordregex = /^[A-Z0-9a-z]{1}[A-Za-z0-9.@#$&]{7,14}$/
        if (!Passwordregex.test(password)) {
            return res.status(401).send({ Status: false, message: " Please enter a valid password, minlength 8, maxxlength 15" })
        }

        //generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        passwordValue = await bcrypt.hash(password, salt);

         // creating object to putiing valid value in each field
         let userBody = {fname: fname, lname: lname, email: email, password: passwordValue}

        // Creating new user==//
        let createUser = await userModel.create(userBody)
        return res.status(201).send({ status: true, message: "User registered Successfully", data: createUser })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

//******************************** LOGIN ************************************

const login = async function (req, res) {
    try {

        let body = req.body

        //Checking body is or not 
        if (Object.keys(body).length === 0) {
            return res.status(400).send({ Status: false, message: "Please provide login credential" })
        }
        
        const { email, password } = body  // destructing

//------------------- Email validation -------------------//

       // Email is Mandatory...
        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "Email is required" })
        };

        // For Valid Email...
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, message: ' Email should be a valid' })
        };

//------------------- password validation -------------------//

        // Password is Mandatory...
        if (!isValid(password)) {
            return res.status(400).send({ Status: false, message: " password is required" })
        }
//-------------------checking User Detail present in DB or not-------------------//
        
        let checkUser = await userModel.findOne({ email: email });

        //email is correct or not
        if (!checkUser) {
            return res.status(401).send({ Status: false, message: "email is incorrect or not present" });
        }

        let passwordMatch = await bcrypt.compare(password, checkUser.password)
        if (!passwordMatch) {
            return res.status(401).send({ status: false, msg: "incorect password" })
        }

        //------------------- generating token for user -------------------//

        let userToken = jwt.sign({
            userId: checkUser._id,  // Payload of token
            batch: "Uranium"

        }, '-EnukeSoftware-', { expiresIn: '86400s' }); // token will expire in 24hrs

        return res.status(200).send({ status: true, message: "User login successfull", data: { userId: checkUser._id, token: userToken } });

    }

    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


module.exports = { registration, login }