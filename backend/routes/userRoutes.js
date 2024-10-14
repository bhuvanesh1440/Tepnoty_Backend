const express = require("express");
const userDetailsController = require("../controllers/userDetailsController");
const passwordController = require("../controllers/passwordController");
const communityController = require("../controllers/communityController");
const otpController = require("../controllers/otpController");
const { protect } = require("../middleware/authMiddleware");
const { use } = require("bcrypt/promises");

const router = express.Router();


// verify user
router.post("/verify-phno", userDetailsController.verifyPhoneNumber); //working
router.post("/verify-userId", userDetailsController.verifyUserId); //working
router.put("/verify-email",protect, userDetailsController.verifyEmail); //working
// User details routes
router.post("/signup", userDetailsController.signup);
router.get("/profile", protect, userDetailsController.getProfile);
router.put("/profile/edit", protect, userDetailsController.editProfile);
router.delete("/profile/delete", protect, userDetailsController.deleteProfile);

router.get("/",protect, userDetailsController.allUsers);


// Password routes
router.post("/login", passwordController.login);
router.put("/reset-password", protect, passwordController.resetPassword); //working
router.get("/refresh", passwordController.refresh); //working



// Community routes
router.get('/get-mutuals',protect,userDetailsController.getRandomMutualConnections)

// OTP routes
router.post("/send-otp", otpController.generateOTP); // add the send sms functionality 
router.post("/verify-otp", otpController.verifyOTP);

module.exports = router;



