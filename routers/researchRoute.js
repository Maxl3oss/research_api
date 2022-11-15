const express = require("express");
const researchController = require("../controllers/researchController");
const router = express.Router();

// router.get("/get", researchController.getAll);
router.get("/get", researchController.getLimit);

module.exports = router;
