const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId


const userUploadSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "users",
        required:true,
        trim: true
    },
    image:{
        type:String,
        required:true
    }

    }, { timestamps: true })

module.exports= mongoose.model("UserImage", userUploadSchema)



