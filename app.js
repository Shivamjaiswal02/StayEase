if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
// const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
// const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
// const {listingschema} = require('./schema');
const Review = require('./models/review');
// const {reviewschema} = require('./schema');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js'); //importing user model

const listingRouter = require('./router/listing'); //importing listing routes
const reviewRouter = require('./router/review'); //importing review routes
const userRouter = require('./router/user'); //importing user routes
const {cloudinary, storage} = require('./cloudconfig'); //importing cloudinary configuration and storage

//middleware to validate listing data using Joi schema

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));//css use karne k liye/static files 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

//let mongo_url = "mongodb://localhost:27017/wanderlust";

let dburl = process.env.ATLASDB_URL;

main().then(() =>{ 
    console.log("connected to db")
})
    .catch(err =>{ 
    console.log(err)
});

async function main() {
    await mongoose.connect(dburl);
}

const store = new MongoStore({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 *3600 //time period in seconds after which session will be updated in the database
});
    
store.on("error", (err) => {
  console.error("Session store error:", err);
});


//it will help to store session data in cookies
const sessionoptions={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, //1 week
        httpOnly: true,
    },
};

app.use(session(sessionoptions));
app.use(flash());

//passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to pass flash messages and current user to all templates
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) => {
  res.send('connection successful to root route');
});

// app.get('/demouser', async (req, res) => {
//     let fakeuser = new User({
//         email: 'shivam@email.com',
//         username: 'johnDoe',
//     });
//     let newUser = await User.register(fakeuser, 'mypassword123'); //register method provided by passport-local-mongoose
//     res.send(newUser);
// });

app.use('/listings/:id/reviews', reviewRouter); //using review routes
app.use('/listings', listingRouter); //using listing routes
app.use('/', userRouter); //using user routes



//     const validateListing = (req, res, next) => {
//         let result = listingschema.validate(req.body);
//         if(result.error) {
//             let msg = result.error.details.map(el => el.message).join(',');
//             throw new ExpressError(400, msg);
//         }else {
//             next();
//         }
//     };


    // const validatereview = (req, res, next) => {
    //     let result = reviewschema.validate(req.body);
    //     if(result.error) {
    //         let msg = result.error.details.map(el => el.message).join(',');
    //         throw new ExpressError(400, msg);
    //     }else {
    //         next();
    //     }
    // };
//       //Index route to display all listings
// app.get('/listings', wrapAsync(async (req, res) => {
//     let alllistings = await Listing.find({});
//     res.render("index.ejs", {alllistings});
//     console.log("listings sent");
// }));

//       // new route to display form to create a new listing
// app.get('/listings/new', (req, res) => {
//     res.render("new.ejs");
//     console.log("new listing form sent");
// });

//       //Create route to add a new listing to the database
// app.post('/listings',
//     validateListing,
//     wrapAsync( async (req, res,next) => { 
//         // if(!req.body.listing) {
//         //     throw new ExpressError(400,"Invalid Listing Data");
//         // }
//     let newListing = new Listing(req.body);

//     // if(!newListing.title || !newListing.description || !newListing.price || isNaN(newListing.price) ) {
//     // throw new ExpressError(400,"Invalid Listing Data");
//     //}
//     await newListing.save();
//     res.redirect('/listings');
//     console.log("new listing created");
// }));

//         //edit route to display form to edit a listing
// app.get('/listings/:id/edit',wrapAsync( async (req, res) => {
//     let {id} = req.params;
//     let listing = await Listing.findById(id);
//     res.render("edit.ejs", {listing});
//     console.log("edit listing form sent");
// }));

//         //update route to update a listing in the database
// app.put('/listings/:id',
//      validateListing,
//      wrapAsync(async (req, res) => {
//     let {id} = req.params;
//     let listing = await Listing.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
//     res.redirect(`/listings/${listing._id}`);
//     console.log("listing updated");
// }));

//         //delete route to delete a listing from the database
// app.delete('/listings/:id',wrapAsync( async (req, res) => {
//     let {id} = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect('/listings');
//     console.log("listing deleted");
// }));

//       //Show route to display a single listing by ID
// app.get('/listings/:id', wrapAsync(async (req, res) => {
//     let {id} = req.params;
//     let listing = await Listing.findById(id).populate('reviews');
//     res.render("show.ejs", {listing});
//     console.log("single listing sent");
// }));

       // review creation route
// app.post('/listings/:id/reviews',validatereview, wrapAsync( async (req, res) => {
//     let {id} = req.params;
//     let listing = await Listing.findById(id);
//     let newreview = new Review(req.body.review);
//     listing.reviews.push(newreview);
//     await newreview.save();
//     await listing.save();
//     res.redirect(`/listings/${listing._id}`);
//     console.log("review added");
// }));

//         //delete review route
// app.delete('/listings/:id/reviews/:reviewId', wrapAsync( async (req, res) => {
//     let {id, reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
//     console.log("review deleted");
// }));


// app.get('/testlistings', async (req, res) => {
//     let sampleListings = new Listing({
//         title: "my new villa",
//         description: "a beautiful villa",
//         image: "",
//         price: 1000,
//         location: "California",
//         country: "USA"    
//     });
//     await sampleListings.save();
//     res.send("successful testing");
//     console.log("sample listing created");
// });

// Catch-all route for 404 (Page Not Found)
app.use((req, res, next) => {
    next(new ExpressError(404,"Page Not Found"));
});

// Global error-handling middleware
app.use((err, req, res, next) => {
    // Set defaults in case statusCode or message is missing
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
    
    // Send a simple response (you can also render an EJS error page)
    //res.status(statusCode).send(message);
});

  

app.listen(port, () => {
  console.log("app is listening on port 8080");
});