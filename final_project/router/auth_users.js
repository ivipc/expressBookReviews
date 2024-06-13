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
  // Check if the username is already registered
  if(!isValid(username)){
    return false;
  }
  // Check if the password is correct
  for(let user in users){
    if(users[user].username == username && users[user].password == Buffer.from(password).toString('base64')){
      return true;
    }
  }
}

// only registered users can login - Task 7
regd_users.post("/login", (req,res) => {
  // Logging in as a registered user
  const {username, password} = req.body;
  // Check if the username and password are provided
  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }
  // Check credentials
  if(!authenticatedUser(username,password)){
    return res.status(401).json({message: "Invalid credentials"});
  }
  // Generate token and save it in the session
  const token = jwt.sign({username}, "token_customer", {expiresIn: "1h"});
  req.session.token = token;
  // Return a success message
  return res.status(200).json({message: "Login successful"});
  

});

// Add a book review - Task 8
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Authentication is already done by the middleware
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;
  // Retrieve the review from the request query
  const review = req.query.review;
  // Retrieve the username from the session
  const username = req.user.username;
  // Initialize a boolean variable to check if the book is found
  let bookFound = false;
  // Initialize a boolean variable to check if the book is reviewed by the user
  let userReviewed = false;
  // Iterate through the ‘books’ array & check the ISBN matches the one
  for(let book in books){
    if(books[book].isbn == isbn){
      // Check if the user has already reviewed the book
      for(let review_user in books[book].reviews){
        if(books[book].reviews[review_user].username == username){
          // Modify the existing review
          books[book].reviews[review_user].review = review;
          bookFound = true;
          userReviewed = true;
          break;
        }
      }
      // If the user has not reviewed the book, add a new review
      if(!bookFound){
        books[book].reviews[username] = {username, review};
        bookFound = true;
      }
      break;
    }
  };
  // console.log({books});
  // Check if the book is found
  if(bookFound){
    // Return a success message
    if (userReviewed){
      return res.status(200).json({message: "Review modified successfully"});
    }
    return res.status(200).json({message: "Review added successfully"});
  } else {
    // If the book is not found, return a 404 error
    return res.status(404).json({message: "Book not found"});
  };
});

// Deleting a book review under - Task 9
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Filter & delete the reviews based on the session username, so that a user can delete only his/her reviews and not other users’.
  // Authentication is already done by the middleware
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn
  // Retrieve the username from the session
  const username = req.user.username
  // Initialize a boolean variable to check if the book is found
  let bookFound = false;
  // Initialize a boolean variable to check if the book is reviewed by the user
  let userReviewed = false;
  // Iterate through the ‘books’ array & check the ISBN matches the one
  for(let book in books){
    if(books[book].isbn == isbn){
      // The book is found
      bookFound = true;
      // Check if the user has already reviewed the book
      for(let review_user in books[book].reviews){
        if(books[book].reviews[review_user].username == username){
          // Delete the review
          delete books[book].reviews[review_user];
          userReviewed = true;
          break;
        }
      }
      break;
    }
  };
  if (bookFound){
    // Return a success message
    if (userReviewed){
      return res.status(200).json({message: "Review deleted successfully"});
    }
    return res.status(200).json({message: "Review not found"})
  }
  // If the book is not found, return a 404 error
  return res.status(404).json({message: "Book not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
