const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Task 6 - Register a new user
public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required."
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists!"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registered. Now you can login."
  });
});


// Task 1 - Get the book list available in the shop
public_users.get('/', function (req, res) {

  return res.status(200).send(
    JSON.stringify(books, null, 4)
  );

});


// Task 2 - Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({
    message: "Book not found."
  });

});


// Task 3 - Get book details based on author
public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;
  let result = {};

  Object.keys(books).forEach((isbn) => {

    if (books[isbn].author === author) {
      result[isbn] = books[isbn];
    }

  });

  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({
    message: "No books found for this author."
  });

});


// Task 4 - Get all books based on title
public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;
  let result = {};

  Object.keys(books).forEach((isbn) => {

    if (books[isbn].title === title) {
      result[isbn] = books[isbn];
    }

  });

  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({
    message: "No books found with this title."
  });

});


// Task 5 - Get book review
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found."
    });
  }

  return res.status(200).json(
    books[isbn].reviews
  );

});


// Task 10 - Get all books using Async/Await with Axios
const getAllBooksAsync = async () => {

  try {

    const response = await axios.get(
      'http://localhost:5000/'
    );

    console.log(response.data);

    return response.data;

  } catch (error) {

    console.error(error.message);

  }

};


// Task 11 - Get book details by ISBN using Async/Await with Axios
const getBookByISBNAsync = async (isbn) => {

  try {

    const response = await axios.get(
      `http://localhost:5000/isbn/${isbn}`
    );

    console.log(response.data);

    return response.data;

  } catch (error) {

    console.error(error.message);

  }

};


// Task 12 - Get book details by Author using Async/Await with Axios
const getBooksByAuthorAsync = async (author) => {

  try {

    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`
    );

    console.log(response.data);

    return response.data;

  } catch (error) {

    console.error(error.message);

  }

};


module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNAsync = getBookByISBNAsync;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;