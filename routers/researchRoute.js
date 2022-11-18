const express = require("express");
const researchController = require("../controllers/researchController");
const authMiddleware = require("../middleware/authMiddleware")
const router = express.Router();

// router.get("/get", researchController.getAll);
router.get("/get", researchController.getLimit);
router.post("/post", authMiddleware, researchController.post);

module.exports = router;
