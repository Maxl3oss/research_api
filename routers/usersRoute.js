const express = require("express");
const usersController = require("../controllers/usersController");
const { authenticateJWT, isAdmin } = require("../middleware/authMiddleware")
const router = express.Router();

router.get("/getAll", authenticateJWT, isAdmin, usersController.getAll);

module.exports = router;
