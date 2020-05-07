const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  imageUrls:{
      type:[String]
  },
  videoUrls:{
      type:[String]
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId, 
    required: true, ref: 'User'
  },
  companyId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "companies",
  },
  createdDate: { type: Date, default: Date.now },
});

const postData = mongoose.model("posts", postSchema);

exports.postData = postData;
