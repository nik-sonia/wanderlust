const listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const Geocodingclient = mbxGeocoding({ accessToken: maptoken });



module.exports.index = async (req,res)=>{
    const alllistings =  await listing.find({})
  res.render("index.ejs", {alllistings})

}

module.exports.renderNewform = (req,res)=>{
    res.render("create.ejs");
 
};

module.exports.showListing = async (req,res)=>{
    let {id} =  req.params;
    const listings = await listing.findById(id)
    .populate({path: "reviews",populate: {
      path: "author"
    }})
    .populate("owner");
    if(!listings){
      req.flash("error", "Listing you requested for does not exist!")
      res.redirect("/listings")
    }
  
    res.render("show.ejs",{listings});
};

module.exports.createListing = async (req,res,next)=>{
  let response = await Geocodingclient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send();
    
    let url = req.file.path;
    let filename = req.file.filename;
  
    const newlisting = new listing(req.body.listing)
    newlisting.owner = req.user._id;
    newlisting.image = {url , filename};

    newlisting.geometry =  response.body.features[0].geometry;

    let savedlisting = await newlisting.save()
    console.log(savedlisting);
    
    req.flash("success", "New listing Added")
    res.redirect("/listings")
};

module.exports.editListing = async (req,res) =>{
    let {id} =  req.params;
    const alllistings = await listing.findById(id);
    if(!alllistings){
      req.flash("error", "Listing you requested for does not exist!")
      res.redirect("/listings")
    }
    res.render("edit.ejs", {alllistings})
};

module.exports.updateRoute = async (req,res)=>{
    let {id} =  req.params;
     let listing1 = await listing.findByIdAndUpdate(id,{...req.body.listing});

      if(typeof req.file !== "undefined"){ 
      let url = req.file.path;
      let filename = req.file.filename;
      listing1.image ={url , filename};
      await listing1.save();
    };
     req.flash("success", "Listing updated!")
     res.redirect(`/listings/${id}`)
};

module.exports.deleteRoute = async(req,res) =>{
    let {id} =  req.params;
   let deletedlisting =  await listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success", " listing Deleted")
    res.redirect("/listings")
};