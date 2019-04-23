/* Dependencies */
var mongoose = require("mongoose"),
  Listing = require("../models/listings.server.model.js");
var config = require("../config/config");
/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the listing(s) as JSON in the response.
  HINT: if you are struggling with implementing these functions, refer back to this tutorial 
  from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 */

/* Create a listing */
exports.create = function(req, res) {
  /* Instantiate a Listing */
  var listing = new Listing(req.body);

  /* Then save the listing */
  listing.save(function(err) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(listing);
    }
  });
};

/* Show the current listing */
exports.read = function(req, res) {
  /* send back the listing as json from the request */
  res.json(req.listing);
};

/* Update a listing */
exports.update = function(req, res) {
  var listing = req.listing;
  var newListing = req.body;
  /** TODO **/
  /* Replace the article's properties with the new properties found in req.body */
  /* Save the article */
  Listing.findOneAndUpdate(
    { _id: listing._id },
    {
      code: newListing.code,
      name: newListing.name,
      address: newListing.address
    },
    { new: true },
    (err, listing) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        console.log(listing);
        res.status(200).json(listing);
      }
    }
  );
};

/* Delete a listing */
exports.delete = function(req, res) {
  var listing = req.listing;
  /** TODO **/
  /* Remove the article */
  Listing.findOneAndRemove({ _id: listing._id }, (err, listing) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.status(200).json(listing);
    }
  });
};

/* Retrieve all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {
  /** TODO **/
  /* Your code here */
  return Listing.find({}, (err, listings) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      return res.status(200).json(listings);
    }
  }).sort({ code: 1 });
};

//Find the listing by the given id, then give this listing to the next
//call. 

exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(err, listing) {
    if (err) {
      res.status(400).send(err);
    } else {
      req.listing = listing;
      next();
    }
  });
};
