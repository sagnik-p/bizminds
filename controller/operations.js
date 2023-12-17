const Operation=require("../models/operations");
const Counter=require("../models/counters");

// Validate the content inside the arrays
function validateOperation(operation) {
    const { operation_id, product, supplier, price, date } = operation;
  
    if (
      operation_id ||
      typeof product !== 'string' ||
      typeof supplier !== 'string' ||
      typeof price !== 'string' ||
      !Date.parse(date)
    ) {
      return false;
    }
  
    // Add further validation rules if needed
    // Example: Validate specific conditions for price or other fields
  
    return true;
  }
  
  function validateOperationsArray(array) {
    if (!Array.isArray(array)) {
      return false;
    }
  
    for (const operation of array) {
      if (!validateOperation(operation)) {
        return false;
      }
    }
  
    return true;
  }
  
  // Update the validateRequestBody function
  function validateRequestBody(req) {
    const { merchant_id, backlog, placed, delivered, cancelled } = req.body;
  
    if (
      typeof merchant_id !== 'string' ||
      !validateOperationsArray(backlog) ||
      !validateOperationsArray(placed) ||
      !validateOperationsArray(delivered) ||
      !validateOperationsArray(cancelled)
    ) {
      return false;
    }
  
    return true;
  }

  const addOperation=async (req, res) => {
    try {
      // Validate the request body
      if (!validateRequestBody(req)) {
        return res.status(400).json({ error: 'Invalid request body structure' });
      }
  
      // Extract data from the request body
      const { merchant_id, backlog, placed, delivered, cancelled } = req.body;

      const counter=await Counter.find({name:"counter"});
      let value=counter[0].value;

  
      // Create a new operations document
      const newOperation = new Operation({
        merchant_id,
        backlog: backlog.map(item => {
            value++;
            return { ...item, operation_id: `o${value}` }
        }),
        placed: placed.map(item => {
            value++;
           return { ...item, operation_id: `o${value}` }
        }),
        delivered: delivered.map(item => {
            value++;
           return { ...item, operation_id: `o${value}` }
        }),
        cancelled: cancelled.map(item => {
            value++;
           return { ...item, operation_id: `o${value}` }
        }),
    });

    const updateCounter=await Counter.updateOne({name:"counter"},{$set:{value:value}});
  
      // Save the new operations document to the database
      const savedOperation = await newOperation.save();
  
      res.status(201).json({ message: 'Operation added successfully', operation: savedOperation });
    } catch (error) {
      console.error('Error while adding operation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };  

  const addSpOperation=async (req, res) => {
    try {
      const { merchant_id, type } = req.params;
      const { product, supplier, quantity, date} = req.body;
  
      // Validate date format
      const currentDate = new Date();
  
      if (!product || !supplier || !quantity || !date) {
        return res.status(400).json({ error: 'Missing required fields in the request body' });
      }

      const counter=await Counter.find({name:"counter"});
      let value=counter[0].value;
      value++;
  
      const newOperation = {
        operation_id: `o${value}`,
        product,
        supplier,
        quantity,
        date: date || currentDate.toISOString(), 
      };

      const updateCounter=await Counter.updateOne({name:"counter"},{$set:{value:value}});
  
      // Update the operation in the specified array
      await Operation.updateOne(
        { merchant_id },
        { $push: { [type]: newOperation } }
      );
  
      res.status(201).json({ message: 'Object added to the array successfully', operation: newOperation });
    } catch (error) {
      console.error('Error while adding object to array:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  const editOperation = async (req, res) => {
    try {
      const { merchant_id, type, operation_id } = req.params;
      const updateFields = req.body; // Object containing fields to update
  
      // Check if fields are allowed to be edited
      const allowedFields = ['product', 'supplier', 'quantity'];
      for (const field in updateFields) {
        if (!allowedFields.includes(field)) {
          return res.status(400).json({ error: `Invalid field '${field}' for editing` });
        }
      }
  
      // Construct update object to update multiple fields
      const updateObject = {};
      for (const field in updateFields) {
        updateObject[`${type}.$.${field}`] = updateFields[field];
      }
  
      // Find and update the specified fields in the specified array
      const updatedOperation = await Operation.findOneAndUpdate(
        { merchant_id, [`${type}.operation_id`]: operation_id },
        { $set: updateObject },
        { new: true }
      );
  
      if (!updatedOperation) {
        return res.status(404).json({ error: 'Operation not found' });
      }
  
      res.status(200).json({ message: 'Object updated successfully', operation: updatedOperation });
    } catch (error) {
      console.error('Error while editing object:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  const deleteOperation = async (req, res) => {
    try {
      const { merchant_id, type, operation_id } = req.params;
  
      const operationBeforeDeletion = await Operation.findOne({ merchant_id });
  
      if (!operationBeforeDeletion || !operationBeforeDeletion[type]) {
        return res.status(404).json({ error: 'Operation not found' });
      }
  
      const operationExistsBeforeDeletion = operationBeforeDeletion[type].some(
        (item) => item.operation_id === operation_id
      );
  
      if (!operationExistsBeforeDeletion) {
        return res.status(404).json({ error: 'Operation not found' });
      }
  
      const operation = await Operation.findOneAndUpdate(
        { merchant_id, [`${type}.operation_id`]: operation_id },
        { $pull: { [type]: { operation_id } } },
        { new: true }
      );
  
      res.status(200).json({ message: 'Object deleted successfully'});
    } catch (error) {
      console.error('Error while deleting object:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const checkStatus=async (req, res) => {
    try {
      const { merchant_id, operation_id } = req.params;
  
      // Find the operation document based on merchant_id
      const operation = await Operation.findOne({ merchant_id });
  
      if (!operation) {
        return res.status(404).json({ error: 'Merchant not found' });
      }
  
      let arrayType = null;
  
      // Check if operation_id exists in any of the arrays
      if (operation.backlog.some((item) => item.operation_id === operation_id)) {
        arrayType = 'backlog';
      } else if (operation.placed.some((item) => item.operation_id === operation_id)) {
        arrayType = 'placed';
      } else if (operation.delivered.some((item) => item.operation_id === operation_id)) {
        arrayType = 'delivered';
      } else if (operation.cancelled.some((item) => item.operation_id === operation_id)) {
        arrayType = 'cancelled';
      } else {
        return res.status(404).json({ error: 'Operation not found in any array' });
      }
  
      res.status(200).json({ message: `Current Status of the operation is ${arrayType}` });
    } catch (error) {
      console.error('Error while checking array type:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const fetchOperations=async (req, res) => {
    try {
      const { merchant_id } = req.params;
  
      // Find operations for the specified merchant_id
      const operations = await Operation.find({ merchant_id });
  
      if (!operations || operations.length === 0) {
        return res.status(404).json({ error: 'No operations found for the merchant' });
      }
  
      res.status(200).json({ message: 'Operations found:', operations });
    } catch (error) {
      console.error('Error while fetching operations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

const cancelOrder=async (req, res) => {
    try {
      const { merchant_id, operation_id } = req.params;
  
      // Find the operation document based on merchant_id
      const operation = await Operation.findOne({ merchant_id });
  
      if (!operation) {
        return res.status(404).json({ error: 'Merchant not found' });
      }
  
      const placedIndex = operation.placed.findIndex(item => item.operation_id === operation_id);
  
      if (placedIndex === -1) {
        return res.status(404).json({ error: 'Operation not found in placed array' });
      }
  
      const cancelledOperation = operation.placed.splice(placedIndex, 1)[0];
  
      // Add the cancelled operation to the cancelled array
      operation.cancelled.push(cancelledOperation);
  
      // Save the updated document
      await operation.save();
  
      res.status(200).json({ message: 'Operation has been cancelled', operation });
    } catch (error) {
      console.error('Error while canceling operation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports={addOperation,addSpOperation,editOperation,deleteOperation,checkStatus,fetchOperations,cancelOrder};
  