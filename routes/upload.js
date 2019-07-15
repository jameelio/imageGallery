const express = require("express");
const router = express.Router();
const userController = require("../app/api/controllers/users");
const uploadMiddleware = require("../middleware/streamToGCS");

router.post(
  "/upload",
  uploadMiddleware.multer.single("image"),
  streamUploadToGCS,
  userController.uploadImage
);

module.exports = router;
