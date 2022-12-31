const express = require("express");
const usersController = require("../controllers/usersController");
const { authenticateJWT, isAdmin } = require("../middleware/authMiddleware")
const router = express.Router();

router.post("/edit", authenticateJWT, usersController.editByUser);
router.post("/getByEmail", authenticateJWT, usersController.getUserByEmail);

module.exports = router;
