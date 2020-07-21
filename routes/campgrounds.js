let express = require("express");
let router= express.Router();
let NodeGeocoder = require("node-geocoder");
let Campground = require("../models/campground");
let middleware= require("../middleware");

// Geocoder setup

let options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
  };
   
  let geocoder = NodeGeocoder(options);

// INDEX Route show all routes

router.get("/",async (req,res)=>{
    
    // Get all campgrounds from DB
    Campground.find({},(err, allCampGrounds)=>{
        if(err) console.log(err);
        else{
            res.render("campgrounds/index", {campgrounds:allCampGrounds, currentUser: req.user});
        }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let price=req.body.price;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        console.log(err.message);
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      let lat = data[0].latitude;
      let lng = data[0].longitude;
      let location = data[0].formattedAddress;
      let newCampground = {name: name, image: image, description: desc, price:price, author:author, location: location, lat: lat, lng: lng};
      // Create a new campground and save to DB
      Campground.create(newCampground, function(err, newlyCreated){
          if(err){
              console.log(err);
          } else {
              //redirect back to campgrounds page
              console.log(newlyCreated);
              res.redirect("/campgrounds");
          }
      });
    });
  });

//==============================NEW Route==================================
router.get("/new", middleware.isLoggedIn,async (req, res)=>{
    res.render("campgrounds/new");
});

// ===========================SHOW Route==================================
router.get("/:id", async (req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampGround)=>{
        if(err) res.redirect("/campgrounds");
        else{
            //console.log(foundCampGround);
            res.render("campgrounds/show", {campground : foundCampGround});
        }
    });
});

//======================== Edit Campground route =============================
router.get("/:id/edit",middleware.checkCampgroundOwnership, async (req,res)=>{
    Campground.findById(req.params.id, function(err, foundCampGround){
        res.render("campgrounds/edit", {campground: foundCampGround});        
    });
});

//======================= UPDATE CAMPGROUND ROUTE =============================
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        console.log(err.message);
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;
  
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect("/campgrounds/" + campground._id);
          }
      });
    });
  });

//======================== Destroy Campground route ===========================

router.delete("/:id", middleware.checkCampgroundOwnership, async (req,res)=>{
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) res.redirect("/campgrounds");
        else{
            res.redirect("/campgrounds");
        }
    })
});


module.exports = router;