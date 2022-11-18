const express = require("express");
const authController = require("../controllers/authController");
const verifyController = require("../controllers/verifyController");
const authMiddleware = require("../middleware/authMiddleware")
const router = express.Router();

router.post("/signIn", authController.signIn);
router.post("/signUp", authController.signUp);
router.post("/signOut", authMiddleware, authController.signOut);

router.get("/RfToken", authMiddleware, authController.refreshToken);
router.get("/verify-email", verifyController.verifyEmail);

module.exports = router;
