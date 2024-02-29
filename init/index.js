const mongoose = require("mongoose");
const listing = require ("../models/listing.js");
const initdata = require ("./data.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("connected to db")
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL)
};

const initDb =  async () => {
  await listing.deleteMany({});
  initdata.data = initdata.data.map((obj)=> ({...obj,owner: "65ca145b928b64ee759f173f"}));
  await listing.insertMany(initdata.data);
  console.log("data was initialized");
};

initDb();