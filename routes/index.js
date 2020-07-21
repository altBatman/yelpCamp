let express = require("express");
let router= express.Router();
let passport = require("passport");
let User = require("../models/user");

//Landing Page
router.get("/",async (req,res)=>{
    res.render("landing");
});


//===================== Auth Routes===================
// Show register form
router.get("/register", async (req,res)=>{
    res.render("register");
});

// Handle sign up logic

router.post("/register", async (req,res)=>{
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user){
        if(err){
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, ()=>{
            req.flash("success", "Welcome to yelpcamp " + user.username);
            res.redirect("/campgrounds");
        })
    });
})

//==================== Show login form ======================

router.get("/login", async (req,res)=>{
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), async function (req,res) {

       }
);

//===================== Logout route ========================

router.get("/logout", async function(req,res){
    req.logOut();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});


module.exports = router;