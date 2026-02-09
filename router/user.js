const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const User = require('../models/user');
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware');
let usercontroller = require("../controller/user");

   // signup route
router.get('/signup', usercontroller.rendersignupform);

// Signup route
router.post('/signup', wrapAsync(usercontroller.signup));

// login route
router.get('/login', usercontroller.renderloginform);

// login post route
router.post(
   '/login', saveRedirectUrl,
    passport.authenticate('local', { 
        failureRedirect: '/login', 
        failureFlash: true 
    }), usercontroller.login);

//logout route
router.get('/logout', usercontroller.logout);

module.exports = router;