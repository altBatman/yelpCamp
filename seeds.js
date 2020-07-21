let mongoose = require("mongoose"),
Campground = require("./models/campground"),
Comment = require("./models/comment");

let data = [
    {
        name:"Night Sky",
        image:"https://images.unsplash.com/photo-1496947850313-7743325fa58c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
        description:"The night sky view from the hill top campground. Dont miss your favorite star constellations. Who knows maybe you could also see a shooting star or a falling angel"
    },
    {
        name:"Snow White",
        image: "https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1395&q=80",
        description:"blah blah blah"
    },
    {
        name: "Recon camp",
        image: "https://images.unsplash.com/photo-1478810810369-07072c5ef88b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
        description:"blah blah blah"
    },
    {
        name: "Trailer camp",
        image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
        description:"blah blah blah"
    }
]

function seedDB(){
    Campground.remove({}, (err)=>{
        if(err) console.log(err);
        console.log("removed campgrounds");
        // Adding data to CampgroundDB
        data.forEach((seed)=>{
            Campground.create(seed, (err, campground)=>{
                if(err) console.log(err);
                else{
                    console.log("Added campground");

                    //Create a comment
                    Comment.create(
                        {
                            text:"This Place is great", 
                            author:"Sherlock Holmes"
                        }, function (err, comment){
                            if(err) console.log(err);
                            else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        }
                    );
                }
            });
        });
    });
}
module.exports= seedDB;