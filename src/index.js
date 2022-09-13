// express is an server-side web framework for node.js which execute our code on the web
const express = require("express");
const mongoose = require("mongoose"); //ODM library for mongoDB
const route = require("./routes/route.js"); //imported route
const multer = require("multer")

const app = express(); //Assign express in app variable


app.use(express.json());  //transforms the text-based JSON input into JS-accessible variables

app.use(multer().any())

//a framework that helps to establish a connection b/w node and mongoDB
mongoose
    .connect(
        "mongodb+srv://Uranium-Batch:aruSjkdGdfhc9MRK@functionup.eel5r.mongodb.net/Enuke_Assignment", {
            useNewUrlParser: true,
        }
    )
    .then(() => console.log("mongoDB is Connected")) //return fullfiled promise
    .catch((err) => console.log(err)); //return rejected promise

app.use("/", route);

//port is two-way communication link between two programs running on the network
app.listen(process.env.PORT || 3000, function() {
    console.log("Express app running on port " + (process.env.PORT || 3000));
});