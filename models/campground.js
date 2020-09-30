/* Setup of campground entities in DB */
const mongoose = require('mongoose');

/* SCHEMA setup */
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
    
// Campground.create(
//   {
//     name: 'Loch Lomond & The Trossachs', 
//     image: 'https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
//     description: 'Mersmerizing nature. Have an unforgettable stay with your favorite animal - quokkas'
//   }, (err, campground) => {
//     if (err) console.log(err);
//     else console.log(campground);
//   }
// )

module.exports = mongoose.model('Campground', campgroundSchema);