//***** Modules goes here *****//
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const express = require("express");
const Joi = require("joi");
const { userroleData } = require("../../Models/userRole.model");
const { postData } = require('../../Models/post.model');
const auth = require('../../middleware/auth');
const upload = require('../../constants/multer');
const cloudinary = require('../../constants/cloudinary')
const fs = require('fs');
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();
//***** ///// *****//

//***** Post Request for Signup *****//
app.post('/', upload.fields([{
    name: 'video'
}, {
    name: 'image'
}]), async (req, res) => {
    console.log("asasasa")
    const uploader = async (path) => await cloudinary.uploads(path, 'Images');
    const videoUploader = async (path) => await cloudinary.uploads(path, 'videos');
    console.log(req.files)
    var imageUrls = [];
    var videoUrls = [];

    const imageFiles = req.files.image;
    const videoFiles = req.files.video;
    console.log(imageFiles,videoFiles)
    // if (imageFiles) {
    //     for (const file of imageFiles) {
    //         const { path, fieldname } = file;
    //         const imagePath = await uploader(path)
    //         imageUrls.push(imagePath)
    //         fs.unlinkSync(path)
    //     }
    // }
    if (videoFiles) {
        for (const file of videoFiles) {
            const { path, fieldname } = file;
            const videoPath = await videoUploader(path)
            console.log(videoPath)
            videoUrls.push(videoPath)
            fs.unlinkSync(path)
        }
    }
 

    res.status(200).json({
        message: 'images uploaded successfully',
        // files: files
        data: {videos:videoUrls,image:imageUrls}
    })

})
//***** ///// *****//

//***** User signup data validation function *****//
function validatePostData(companyData) {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        numberOfEmployer: Joi.number().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        province: Joi.string().required(),
        postalCode: Joi.number().required(),
        businessTaxId: Joi.string().required(),
        businessEmail: Joi.string().email({ minDomainAtoms: 2 }).required(),
        businessTelephone: Joi.number().required(),
        businessCertificate: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
    });
    return Joi.validate(companyData, schema);
}
//***** ///// *****//

async function getRole(data) {
    const role = await userroleData.findOne({ userId: data });
    return role;
}


//***** Initialing and saving data *****//
async function createCompany(data) {
    const company = new companyData(data)
    var result;
    try {
        result = await company.save();
    } catch (err) {
        return { success: false, error: err, data: null };
    }
    return { success: true, data: result };

}


//***** ///// *****//

module.exports = app;
