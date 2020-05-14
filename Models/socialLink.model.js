const mongoose = require("mongoose");
const validator = require("validator");

const socialLinkSchema = mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "companies",
  },
  socialURL: [
    {
      socialType: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        validate(value) {
          if (!validator.isURL(value)) {
            throw new Error("Invalid URL.");
          }
        },
      },
    },
  ],
});

const socialLink = mongoose.model("socialLink", socialLinkSchema);

exports.socialLink = socialLink;
