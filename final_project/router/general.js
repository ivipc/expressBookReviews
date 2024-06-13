const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Import Axios
const axios = require('axios');

// Register a new user - Task 6
public_users.post("/register", (req,res) => {
    // Retrieve the username and password from the request body
    const {username, password} = req.body;
    // Check if the username and password are provided
    if(!username || !password){
        return res.status(400).json({message: "Username and password are required"});
    }
    // Check if the username is already registered
    if(isValid(username)){
        return res.status(400).json({message: "Username already exists"});
    }
    // Create a new user object with the provided username and password, save password in base64
    const newUser = {username, password: Buffer.from(password).toString('base64')};
    // Add the new user to the users array
    users.push(newUser);
    // Return a success message
    return res.status(200).json({message: "Registration successful"});
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
    if(Object.keys(reviews).length > 0){
        // Return the array of reviews for the book
        return res.status(200).send(JSON.stringify({reviews}, null, 4));
    }
    if (!bookFound){
        // If no reviews were found, return a 404 error
        return res.status(404).json({message: "Book not found"});
    }
    // If no reviews were found, return a 404 error
    return res.status(404).json({message: "Book found but no reviews"});
    
});

// Getting the list of books available in the shop (done in Task 1) using async-await with Axios - Task 10
public_users.get('/async', async function (req, res) {
    try {
        // Make a GET request to the server
        const response = await axios.get('http://localhost:5000/');
        // Check if the request was successful
        if (response.status !== 200) {
            throw new Error('Request failed with status code ' + response.status);
        }
        // Return the book list as JSON
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        // Handle any errors that occur during the request
        console.error({error});
        // Return a 404 error if the book is not found
        return res.status(404).json({message: "An error occurred while fetching the book list"});
    }    
});

// Getting the book details based on ISBN (done in Task 2) using async-await with Axios - Task 11
public_users.get('/async/isbn/:isbn', async function (req, res) {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
    try {
        // Make a GET request to the server
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        // Check if the request was successful
        if (response.status !== 200) {
            throw new Error('Request failed with status code ' + response.status);
        }
        // Return the book details as JSON
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        // Handle any errors that occur during the request
        console.error({error});
        // Return a 404 error if the book is not found
        return res.status(404).json({message: "An error occurred while fetching the book details"});
    }
});

// Getting the book details based on Author (done in Task 3) using async-await with Axios - Task 12
public_users.get('/async/author/:author', async function (req, res) {
    // Retrieve the author from the request parameters
    const author = req.params.author;
    try {
        // Make a GET request to the server
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        // Check if the request was successful
        if (response.status !== 200) {
            throw new Error('Request failed with status code ' + response.status);
        }
        // Return the book details as JSON
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        // Handle any errors that occur during the request
        console.error({error});
        // Return a 404 error if the book is not found
        return res.status(404).json({message: "An error occurred while fetching the book details"});
    }
});

// Getting the book details based on Title (done in Task 4) using async-await with Axios - Task 13
public_users.get('/async/title/:title', async function (req, res) {
    // Retrieve the title from the request parameters
    const title = req.params.title;
    try {
        // Make a GET request to the server
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        // Check if the request was successful
        if (response.status !== 200) {
            throw new Error('Request failed with status code ' + response.status);
        }
        // Return the book details as JSON
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        // Handle any errors that occur during the request
        console.error({error});
        // Return a 404 error if the book is not found
        return res.status(404).json({message: "An error occurred while fetching the book details"});
    }
});

module.exports.general = public_users;
