const express = require("express");
const researchController = require("../controllers/researchController");
const { authenticateJWT } = require("../middleware/authMiddleware")
const router = express.Router();
const path = require("path");
// upload File
const multer = require("multer");
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads/') + file.fieldname)
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
   }
})
const upload = multer({
   storage: storage,
   limits: {
      fileSize: 10000000, // Around 10MB
   },
   abortOnLimit: true,
});

// router.get("/get", researchController.getAll);
router.get("/get", researchController.getLimit);
router.get("/get/:id", researchController.getById);
router.post("/post", upload.any(), authenticateJWT, researchController.post);
router.get("/file/:id/download", authenticateJWT, researchController.getFileById);

module.exports = router;
