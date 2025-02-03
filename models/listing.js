// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     desc: String,
//     image: {
//         type: String,
//         set: (v) =>
//             v === ""
//                 ? "https://unsplash.com/photos/concrete-house-near-a-body-of-water-and-forest-XJnP4L958ds"
//                 : v,
//     },
//     price: Number,
//     location: String,
//     country: String,
// })

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        filename: {
            type: String,
            default: "defaultimage"
        },
        url: {
            type: String,
            required: true,
            default: "https://unsplash.com/photos/concrete-house-near-a-body-of-water-and-forest-XJnP4L958ds"
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
