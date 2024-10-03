const express = require("express");
const userController = require('../controllers/userControllers')
const { protect } = require("../middleware/authMiddleware");
const {verifyPhoneNumber} = require("../controllers/userControllers");

const router = express.Router();


router.post("/verify-phno", userController.verifyPhoneNumber); //working
router.post("/signup", userController.signup); //working
router.post("/login", userController.login); //working
router.put("/reset-password", protect,userController.resetPassword); //working
router.get("/refresh", userController.refresh); //working

router.get("/profile", protect, userController.getProfile);//working
router.put("/profile/edit", protect, userController.editProfile);//working
router.delete("/profile/delete", protect, userController.deleteProfile);//working

router.get("/",protect, userController.allUsers);

// router.post("/feedback", protect, userController.reportFeedback); // Use the imported function
// router.get("/get_feedback", protect, userController.getFeedback);
// router.post("/reset-password/send-otp", userController.sendOtp); // Only authenticated users
// router.post("/reset-password/verify-otp", userController.verifyOtp);
// router.post("/reset-password/new-password", userController.resetPassword);


module.exports = router;
