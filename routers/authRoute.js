const express = require("express");
const authController = require("../controllers/authController");
const verifyController = require("../controllers/verifyController");
const { authenticateJWT } = require("../middleware/authMiddleware")
const router = express.Router();

router.post("/signIn", authController.signIn);
router.post("/signUp", authController.signUp);
router.post("/signOut", authenticateJWT, authController.signOut);

router.post("/RfToken", authenticateJWT, authController.refreshToken);
router.get("/verify-email", verifyController.verifyEmail);

module.exports = router;
