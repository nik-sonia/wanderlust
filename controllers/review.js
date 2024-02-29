const review = require("../models/review.js");
const listing = require("../models/listing.js");


module.exports.createReview = async (req,res) => {
    let endlisting =  await listing.findById(req.params.id);
    let newreview = new review(req.body.review);
    newreview.author = req.user._id;

    endlisting.reviews.push(newreview)

    await endlisting.save()
    await newreview.save()
    req.flash("success", "New Review Added")
    res.redirect(`/listings/${endlisting._id}`);
};
 
module.exports.deleteReview = async (req,res)=>{
    let{id,reviewid} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await review.findByIdAndDelete(reviewid);
    req.flash("success", "Review Deleted")
    res.redirect(`/listings/${id}`);
};