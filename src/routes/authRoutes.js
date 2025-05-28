const express = require("express");
const router  = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');


// route to register user or admin 
router.post('/register', registerUser);

//route for login
router.post('/login', loginUser);

module.exports = router;