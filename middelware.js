const listing = require("./models/listing.js");
const ExpressError = require("./utils/expresserror.js");
const{listingSchema,reviewSchema} = require("./schema.js")
const review = require("./models/review.js");


module.exports.isloggedin = (req,res,next)=>{
  console.log(req);
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl
        req.flash("error", "You must logged in to create a listing");
        return res.redirect("/login");
      }
      next();
};

module.exports.saveredirecturl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req,res,next)=>{
  let {id} =  req.params;
  let listings =  await listing.findById(id);
  if(!listings.owner.equals(res.locals.currntuser._id)){
    req.flash("error", "You Don't Have permission to Edit/Delete");
      return res.redirect(`/listings/${id}`)
  };
  next();
};

module.exports. validatelisting = (req,res,next)=>{
  let{error}= listingSchema.validate(req.body);
  if(error){
      let errmsg = error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400,errmsg);
  }else{
      next();
  }
};

module.exports. validatereview= (req,res,next)=>{
  let{error}= reviewSchema.validate(req.body);
  if(error){
      let errmsg = error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400,errmsg);
  }else{
      next();
  }
};


module.exports.isReviewauthor = async (req,res,next)=>{
  let {id,reviewid} =  req.params;
  let reviews =   await review.findById(reviewid);
  if(!reviews.author.equals(res.locals.currntuser._id)){
    req.flash("error", "You are not the Author of this Review");
      return res.redirect(`/listings/${id}`)
  };
  next();
};