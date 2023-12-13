const express = require("express");
const router=express.Router();
const issue=require("../controller/issue");

router.post("/add",issue.addIssue)

module.exports=router;