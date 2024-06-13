const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    //Write your code here
    return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop - Task 1
public_users.get('/',function (req, res) {
    // Get the JSON of books
    return res.status(200).send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN - Task 2
public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
    // Find the book with the given ISBN
    for(let book in books){
        if(books[book].isbn == isbn){
            bookFound = books[book];
            break;
        }
    };
    // Check if the book is found
    if(bookFound){
        // Return the book details
        return res.status(200).send(JSON.stringify(bookFound, null, 4));
    }
    // If the book is not found, return a 404 error
    return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author - Task 3
public_users.get('/author/:author',function (req, res) {
    // Retrieve the author from the request parameters
    const author = req.params.author;
    // Initialize an empty array to store the books by the given author
    let booksByAuthor = [];
    // Iterate through the ‘books’ array & check the author matches the one provided in the request parameters
    for(let book in books){
        if(books[book].author == author){
            booksByAuthor.push(books[book]);
        }
    };
    // Check if any books were found by the given author
    if(booksByAuthor.length > 0){
        // Return the array of books by the given author
        return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
    }
    // If no books were found, return a 404 error
    return res.status(404).json({message: "Book not found"});
});

// Get all books based on title - Task 4
public_users.get('/title/:title',function (req, res) {
    // Retrieve the title from the request parameters
    const title = req.params.title;
    // Initialize an empty array to store the books with the given title
    let booksByTitle = [];
    // Iterate through the ‘books’ array & check the title matches the one
    for(let book in books){
        if(books[book].title == title){
            booksByTitle.push(books[book]);
        }
    };
    // Check if any books were found with the given title
    if(booksByTitle.length > 0){
        // Return the array of books with the given title
        return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    }
    // If no books were found, return a 404 error
    return res.status(404).json({message: "Book not found"});
});

//  Get book review - Task 5
public_users.get('/review/:isbn',function (req, res) {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
    // Initialize an empty array to store the reviews for the book
    let reviews = [];
    // Initiali<e a boolean variable to check if the book is found
    let bookFound = false;
    // Iterate through the ‘books’ array & check the ISBN matches the one
    for(let book in books){
        if(books[book].isbn == isbn){
            reviews = books[book].reviews;
            bookFound = true;
            break;
        }
    };
    // Check if any reviews were found for the book
    if(reviews.length > 0){
        // Return the array of reviews for the book
        return res.status(200).send(JSON.stringify(reviews, null, 4));
    }
    if (!bookFound){
        // If no reviews were found, return a 404 error
        return res.status(404).json({message: "Book not found"});
    }
    // If no reviews were found, return a 404 error
    return res.status(404).json({message: "Book found but no reviews"});
    
});

module.exports.general = public_users;
