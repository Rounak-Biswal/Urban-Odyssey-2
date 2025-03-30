const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    // image: {
    //     filename: {
    //         type: String,
    //         default: "defaultimage"
    //     },
    //     url: {
    //         type: String,

    //         default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",

    //         set: (link) =>
    //             link === ""
    //                 ? "https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //                 : link,
    //     }
    // },

    image: {
        url: String,
        filename: String
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
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

/*post listing middleware : to delete associated reviews on deleting a listing*/
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
