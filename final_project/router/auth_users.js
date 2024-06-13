const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username already exists - Task 6
const isValid = (username)=>{ // returns boolean
  for(let user in users){
    if(users[user].username == username){
      return true;
    }
  };
  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

// only registered users can login - Task 7
regd_users.post("/login", (req,res) => {
  // Logging in as a registered user
  const {username, password} = req.body;
  // Check if the username and password are provided
  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }
  // Check if the username is already registered
  if(!isValid(username)){
    return res.status(401).json({message: "Invalid credentials"});
  }
  // Define a boolean variable to check if the password is correct
  let isPasswordCorrect = false;
  // Check if the password is correct
  for(let user in users){
    if(users[user].username == username && users[user].password == Buffer.from(password).toString('base64')){
      isPasswordCorrect = true;
      break;
    }
  };
  if(!isPasswordCorrect){
    return res.status(401).json({message: "Invalid credentials"});
  }
  // Generate token and save it in the session
  const token = jwt.sign({username}, "token_customer", {expiresIn: "1h"});
  req.session.token = token;
  // Return a success message
  return res.status(200).json({message: "Login successful"});
  

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
