const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        let registerUser = await User.register(newUser, password);
        console.log(registerUser);

        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to My-Travel!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderloginForm = (req, res) => {
    res.render("user/login");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to My-Travel!");

    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};