"use strict";

const express = require("express");
const { upload } = require("../helpers/filehelper");
const {
  singleFileUpload,
  getallSingleFiles,
  getSingleFile,
  printfile,
  deletefile,
} = require("../controllers/fileuploaderController");
const router = express.Router();

router.post("/singleFile", upload.single("file"), singleFileUpload);
router.get("/getSingleFile/:id", getSingleFile);
router.get("/getSingleFiles", getallSingleFiles);
router.get("/print/:id", printfile);
router.delete("/deletefile/:id", deletefile);

module.exports = {
  routes: router,
};
