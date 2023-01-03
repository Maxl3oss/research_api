const express = require("express");
const usersController = require("../controllers/usersController");
const { authenticateJWT, isAdmin, Profile } = require("../middleware/authMiddleware")
const router = express.Router();

router.post("/edit", authenticateJWT, usersController.editByUser);
router.post("/getByEmail", authenticateJWT, usersController.getUserByEmail);

router.get("/profile", authenticateJWT, Profile);

module.exports = router;
