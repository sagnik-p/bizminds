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

//Get the issues based on merchant_id
const getIssues=async (req, res) => {
    try {
      const { merchant_id } = req.params;
  
      const issues = await Issue.find({ merchant_id });
  
      res.status(200).json({ issues });
    } catch (error) {
      console.error('Error fetching issues:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

  module.exports={addIssue,getIssues};