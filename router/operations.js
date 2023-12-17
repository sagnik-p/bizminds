const express = require('express');
const router = express.Router();
const operations=require("../controller/operations");

//Add and operation for the 1st time
router.post("/add_operation",operations.addOperation);

//Add an operation to any of available arrays(statuses)
router.post('/add/:merchant_id/:type', operations.addSpOperation);

// PATCH endpoint to edit multiple fields of an object in one of the arrays
router.patch('/edit/:merchant_id/:operation_id', operations.editOperation);

// DELETE endpoint to delete an object(Operation) in one of the arrays
router.delete('/delete/:merchant_id/:type/:operation_id', operations.deleteOperation);

// Check the status of the operation
router.get('/check_status/:merchant_id/:operation_id', operations.checkStatus);

//Fetch Operations for an merchant
router.get('/get/:merchant_id', operations.fetchOperations);

// Endpoint to move an operation from placed to cancelled based on merchant_id and operation_id
router.patch('/cancel_operation/:merchant_id/:operation_id', operations.cancelOrder);

//Endpoint to change the status of an operation
router.patch('/move-operation/:merchant_id/:operation_id/:destination', operations.changeStatus);
  
  
  
module.exports=router;