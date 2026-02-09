const User = require("../Models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderLoginForm =  (req, res) => {
  res.render("users/login.ejs");
};

module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;

      const newUser = new User({
        email: email,
        username: username
      });

      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);

      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");

    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };

  module.exports.login = async(req,res) => {
    req.flash("success", "Welcome back to AVENTRA!");
    res.redirect("/listings");
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            next(err);
        }
        req.flash("success", "You're successfully logged out!");
        res.redirect("/listings");
    })
};