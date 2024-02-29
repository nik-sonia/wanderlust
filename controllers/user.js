const User = require("../models/user.js");


module.exports.renderSignupform = (req,res)=>{
    res.render("users/signup.ejs")
};

module.exports.renderLoginform = (req,res)=>{
    res.render("users/login.ejs")
};

module.exports.userSignup = async  (req,res)=>{
    try{
        let{username,email,password}= req.body;
        let newuser = new User({email,username});
        let registereduser = await User.register(newuser,password);
        console.log(registereduser);
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to wanderlust")
            res.redirect("/listings")
        });
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup")
    };
}; 

module.exports.userLogin = async (req,res)=>{
    req.flash("success", "Welcome to wanderlust")
    res.redirect(res.locals.redirectUrl);
};

module.exports.userlogout = (req,res,next)=>{
    req.logout((err)=>{
     if(err){
       return next(err);
     } 
     req.flash("success", "   Your are logged out")
     res.redirect("/listings");

    })
};

