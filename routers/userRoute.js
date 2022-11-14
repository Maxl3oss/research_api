const express = require("express");
const authController = require("../controllers/authController");
const verifyController = require("../controllers/verifyController");
const router = express.Router();

router.post("/signIn", authController.signIn);
router.post("/signUp", authController.signUp);

router.get("/verify-email", verifyController.verifyEmail);

module.exports = router;
