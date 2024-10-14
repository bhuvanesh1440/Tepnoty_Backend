const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const userDetailsSchema = mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    age:{type:Number,required:true},
    user_id: { type: String, required: true, unique: true }, // Unique user identifier
    email: { type: String, required: true, unique: true },
    isEmailVerified:{type:Boolean,default:false,required:true},
    isFeedback:{ type:Boolean, default:false},
    

    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",

    },
    bio:{type: String,default:"I Love Tepnoty"}
    // isDeleted:{type:Boolean,default:false}
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDetails", userDetailsSchema);
