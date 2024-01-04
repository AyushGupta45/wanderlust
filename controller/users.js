const User = require("../models/user.js");

module.exports.signUpPage = (req, res) => {
  res.render("users/signupForm.ejs");
};

module.exports.loginPage = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.postSignUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust");
      res.redirect("/listings/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup/");
  }
};

module.exports.postLogin = (req, res) => {
  req.flash("success", "Welcome to Wanderlust, you are Logged in");
  let redirectUrl = res.locals.redirectUrl || "/listings/";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out");
    res.redirect("/listings");
  });
};
