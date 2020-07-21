let mongoose = require("mongoose");

//Mongoose / Schema Model config
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

let campgroundSchema = new mongoose.Schema({
    name : String,
    image: String,
    price: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username : String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);

/* Campground.create({
    name:"CampGround 1",
    image:"https://images.unsplash.com/photo-1496947850313-7743325fa58c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    description: "The night sky view from the hill top campground. Dont miss your favorite star constellations. Who knows maybe you could also see a shooting star or a falling angel"
    }, (err,campground)=>{
        if(err) console.log(err);
        else{
            console.log("Newly created campground");
            console.log(campground);
        }
    }
); */