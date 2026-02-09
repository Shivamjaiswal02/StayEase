const User = require('../models/user');

module.exports.rendersignupform = (req, res) => {
    res.render('users/signup.ejs');
};

module.exports.signup = async (req, res, next) => {
        try {
            const { username, email, password } = req.body;
            const newUser = new User({ username, email });
            const registerdUser = await User.register(newUser, password);
            console.log(registerdUser);
            req.login(registerdUser, err => {
                if (err) {
                    return next(err);
                }
                req.flash('success', 'Welcome to the app!');
                res.redirect('/listings');
            });
        } catch (err) {
            req.flash('error', err.message);
            res.redirect('/signup');
        }
    };

module.exports.renderloginform = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.login = async(req, res) => {
    req.flash('success', 'Welcome back!');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash('success', 'You have been logged out');
        res.redirect('/listings');
    });
};