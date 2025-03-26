const mongoose = require("mongoose");
const Listing = require("../models/listing");
const dataFile = require("./data");

//db connection
const MONGO_URL = "mongodb://127.0.0.1:27017/UrbanOdyssey";
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("connection to DB successful");
    }).catch(err => {
        console.log(err);
    })

//initialization
const initializeDB = async () => {
    await Listing.deleteMany({});
    dataFile.data = dataFile.data.map((obj) => ({
        ...obj,
        owner: "67e02893c8806c07c761aa7f"
    }))
    await Listing.insertMany(dataFile.data);
    console.log("data initialized");   
}

initializeDB();