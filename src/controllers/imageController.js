const aws = require("../middleware/aws")
const imageModel= require("../models/imageModel")

const uploadimage = async function (req, res) {
    try {

        // accessing file...
        let files = req.files;

        // Defining size limit of image...
        let limitSize = 512000;
 
        // checking the file is present or not...
        if (req.files.length === 0) {
            return res.status(400).send({ status: false, message: "Provide image to upload" })
        }

        // conditional to check image size limit...
        if (files[0].size > limitSize) {
            return res.status(400).send({ status: false, message: "Image is too large" })

        }


        // -------------------checking type of file is valid or not-------------------


        
        if (files[0].mimetype == 'image/png' || files[0].mimetype == 'image/jpeg') {


            //upload filse in aws s3...
            let uploadImage = await aws.uploadFile(files[0]);
            let filterBody ={
                userId:req.userId,
                image:uploadImage 
            }

            // uploading image in particular user's DB...
            let upload = await imageModel.create(filterBody)
            return res.status(200).send({ status: true, message: "Image uploaded successfully", data: upload})
        }

        // if the image type is not in the given format...
        else {
            return res.status(400).send({ status: false, message: "image should be in jpeg or jpg and png" })

        }
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}



module.exports.uploadimage = uploadimage