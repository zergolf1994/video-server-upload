"use strict";
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs-extra");
const mime = require("mime-types");
const path = require("path");
const md5 = require('md5');

const {
  serverDetail,
  serverCreate,
} = require("../controllers/server.controllers");
const { uploadFile } = require("../controllers/upload.controllers");
const { isAuthenticated } = require("../middleware");
const { findStorage } = require("../controllers/find.controllers");
const { remoteUpload } = require("../controllers/remote.controllers");
const { uploadChunk } = require("../controllers/upload-chunk.controllers");

router.all("/", async (req, res) => {
  return res.status(200).json({ msg: "Server Upload" });
});

// upload
router.post("/upload", isAuthenticated, uploadFile);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { file_name } = req.params;
    const tmpPath = path.join(global.dirPublic, "tmp", md5(file_name));
    fs.mkdirSync(tmpPath, { recursive: true });
    cb(null, tmpPath);
  },
  filename: function (req, file, cb) {
    const { item } = req.params;
    const fullname = item;
    cb(null, fullname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/upload-chunk/:file_name/:item",
  isAuthenticated,
  upload.single("chunk"),
  uploadChunk
);

// server
router.get("/server/detail", serverDetail);
router.get("/server/create", serverCreate);

//remote
router.get("/remote", remoteUpload);

router.get("/find/storage", findStorage);
router.all("*", async (req, res) => {
  return res.status(404).json({ error: true, msg: "not found!" });
});

module.exports = router;
