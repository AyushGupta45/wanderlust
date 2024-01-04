const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGOOSE_URL);
}

main()
  .then(() => console.log("Database Connected"))
  .catch(() => console.log("Some error occured Connecting Database"));

const initDB = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "657d858ee7a94659cfe3a92d",
  }));
  await Listing.insertMany(initdata.data)
    .then((res) => {
      console.log("success");
    })
    .catch((err) => {
      console.log("error");
    });
};

initDB();
