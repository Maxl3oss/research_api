const express = require("express");
const usersController = require("../controllers/usersController");
const { authenticateJWT, isAdmin } = require("../middleware/authMiddleware")
const router = express.Router();

router.get("/getAll", authenticateJWT, isAdmin, usersController.getAll);
router.post("/edit", authenticateJWT, usersController.editByUser);
router.post("/getByEmail", authenticateJWT, usersController.getUserByEmail);

module.exports = router;
