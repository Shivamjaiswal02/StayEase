const Listing = require('../models/listing');

// controller/listing.js
module.exports.Index = async(req, res) => {
    let alllistings = await Listing.find({});
    res.render("index.ejs", {alllistings});
    console.log("listings sent");
};

// new route to display form to create a new listing
module.exports.NewListingForm = (req, res) => {
    res.render("new.ejs");
    console.log("new listing form sent");
};

//Create route to add a new listing to the database
module.exports.CreateListing = async(req, res,next) => {
    let url = req.file.secure_url;
    let filename = req.file.filename;
    
    let newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    newListing.image = {url: url, filename: filename};// set image field
    await newListing.save();
    req.flash("success","new listing created");
    res.redirect('/listings');
    console.log("new listing created");
};

//edit route to display form to edit a listing
module.exports.EditListingForm = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error","Cannot find that listing");
        return res.redirect("/listings");
    }
    let originalimageurl = listing.image.url;
    originalimageurl = originalimageurl.replace('/upload', '/upload/h_100,w_250');
    req.flash("success","listing edited");
    res.render("edit.ejs", {listing, originalimageurl});


    console.log("edit listing form sent");
};

//update route to update a listing in the database
module.exports.UpdateListing = async (req, res) => {
        let {id} = req.params;
        let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new:true, runValidators:true});
        if(req.file){
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = {url: url, filename: filename};
            await listing.save();
        }
        req.flash("success","listing updated");
        res.redirect(`/listings/${listing._id}`);
        console.log("listing updated");
};

//delete route to delete a listing from the database

module.exports.destroylisting = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect('/listings');
    console.log("listing deleted");
};

//Show route to display a single listing by ID
module.exports.ShowListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
    if(!listing) {
        req.flash("error","Cannot find that listing");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("show.ejs", {listing});
    console.log("single listing sent");
};