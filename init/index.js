const mongoose = require("mongoose");

const initData = require("./data");

const Listing = require("../models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    const data = initData.data.map((obj) => ({
        ...obj,
        owner: "6ac67279d8ca7bdb4dd4f298"
    }));
    await Listing.insertMany(data);
    console.log("Data was initialized");
};

main()
    .then(() => {
        console.log("Connected to DB");
        return initDB();
    })
    .then(() => {
        console.log("Initialization complete");
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });