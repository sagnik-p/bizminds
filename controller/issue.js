const Issue=require("../models/issues");

//Add Issue
const addIssue= async (req, res) => {
    try {
      // Destructure values from the request body
      const { merchant_id, email, issue } = req.body;
  
      // Create a new Issue instance
      const newIssue = new Issue({
        merchant_id,
        email,
        issue
      });
  
      // Save the new issue to the database
      const savedIssue = await newIssue.save();
  
      // Return a success message with the saved issue data
      res.status(201).json({ message: 'Issue added successfully', issue: savedIssue });
    } catch (error) {
      console.error('Error adding issue:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  module.exports={addIssue};