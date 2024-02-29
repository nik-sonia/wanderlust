if(process.env.NODE_ENV != "PRODUCTION"){
    require("dotenv").config();
};


const express = require("express");
const app = express();
const path = require("path");
const methodOverride =  require("method-override");
const ejsmate = require ("ejs-mate");
const ExpressError = require("./utils/expresserror.js");
const mongoose = require("mongoose");
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport");
const localstrategy = require("passport-local");
const User = require("./models/user.js");


const listingsrouter = require("./routes/listing.js");
const reviewrouter = require("./routes/review.js")
const userrouter = require("./routes/user.js");
const { error } = require("console");


app.set ("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use (express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate)
app.use(express.static(path.join(__dirname,"/public")));

const dburl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl : dburl,
    crypto :{
        secret: process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});

store.on("error", () =>{
console.log("error in mongo session store", err);
})

const sessionoptions ={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};





// app.get("/", (req , res)=>{
//     res.redirect("/listings");
// })


app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen(8080,()=>{
    console.log("app is listening");
})



main()
.then(()=>{
    console.log("server is working")
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dburl);
}


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currntuser = req.user;
  next(); 
});




app.use("/listings", listingsrouter);
app.use("/listings/:id/reviews", reviewrouter);
app.use("/", userrouter)


app.all("*", (req,res,next)=>{
    next(new ExpressError(404, "page not found!"));
 }); 

 app.use((err,req,res,next)=>{
    let{statusCode = 500,message = "something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
    
});














