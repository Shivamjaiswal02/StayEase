const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedIn, isowner, validateListing} = require('../middleware');
const Listing = require('../models/listing');
let listingcontroller = require("../controller/listing");
const multer = require('multer');
const { storage } = require('../cloudconfig');
const upload = multer({ storage });

      //Index route to display all listings
router.get('/', wrapAsync(listingcontroller.Index));

      // new route to display form to create a new listing
router.get('/new', 
    isLoggedIn, 
    listingcontroller.NewListingForm);


      //Create route to add a new listing to the database
router.post('/',
    isLoggedIn,
    // validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingcontroller.CreateListing));

        //edit route to display form to edit a listing
router.get('/:id/edit', 
    isLoggedIn,
    isowner,
    wrapAsync( listingcontroller.EditListingForm));

        //update route to update a listing in the database
router.put('/:id',
    isLoggedIn,
    isowner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingcontroller.UpdateListing));

        //delete route to delete a listing from the database
router.delete('/:id', 
    isLoggedIn,
    isowner,
    wrapAsync(listingcontroller.destroylisting));

      //Show route to display a single listing by ID
router.get('/:id', wrapAsync( listingcontroller.ShowListing));

module.exports = router;