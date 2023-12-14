const express = require("express");
const router=express.Router();
const issue=require("../controller/issue");

//Add Issue
router.post("/add",issue.addIssue)

//Get the issue based on merchant_id
router.get("/get/:merchant_id",issue.getIssues)

module.exports=router;