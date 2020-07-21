let express = require("express");
let router= express.Router({mergeParams: true});
let Campground = require("../models/campground");
let Comment = require("../models/comment");
let middleware= require("../middleware");

//================== Comments Route===================
router.get("/new", middleware.isLoggedIn, async (req,res)=>{

    Campground.findById(req.params.id, function (err,campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground:campground})
        }
    });

})

//Comments  create

router.post("/", middleware.isLoggedIn,async (req,res)=>{
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id =req.user._id;
                    comment.author.username =req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect('/campgrounds/'+ campground._id);
                }
            })
        }
    })
})

//====================== Edit comments route==================================
/* router.get("/:comment_id/edit", middleware.checkCampgroundOwnership, async function(req, res){

    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comments_id", middleware.checkCommentOwnership, async (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds" + req.params.id);
        }
    });
}); */

//============================= Comment destroy route ===============================
router.delete("/:comment_id",middleware.checkCommentOwnership, async function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Success comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;