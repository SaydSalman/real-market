import Listing from "../models/listing.model.js"


import { errorHandler } from "../utils/error.js"


export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body)
        return res.status(201).json(listing) //return the response this listing and send back to user
    } catch (error) {
        next(error)
    }
}

export const deleteListing = async (req, res, next)=>{ //check listing is available or notand check if the id and the id of the person who created listing
    const listing = await Listing.findById(req.params.id)
    if (!listing) {
        return next(errorHandler(401, 'listing is not found'))
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'You can only delete your listing'))
    }
    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json("your list has been deleted")
    } catch (error) {
        next(error)
    }
}


export const updateListing = async(req,res,next)=>{
    const listing = await Listing.findById(req.params.id)
    if(!listing){
        return next(errorHandler(404,'lisitng is not found'))
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401,'you can only edit your lisitng'))
    }
    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(200).json(updatedListing)
    } catch (error) {
        next(error)
    }
}
export const getListing = async(req,res,next)=>{
    try {
        const listing = await Listing.findById(req.params.id)
        if(!listing){
            return next(errorHandler(403,'no lisitng found'))
        }
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
}

export const getListings = async(req,res,next)=>{
    try {
    const limit = parseInt(req.query.limit) || 9; //suppose we only need some properties
    const startIndex = parseInt(req.query.startIndex) || 0; //we will use this to paginate our results
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }

}