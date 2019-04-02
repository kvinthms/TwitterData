//the differences between this and the bootcamp 2 listingFactory are as follows:
//this uses the foo app, not listings
//this factory is called 'SearchResults', not 'Listings'
//this returns more than just a big json doc, because we have to write a function that actually retreives the json before returning it
//this uses Twit to execute a query (so we shouldn't need to do it in the controller)
//this returns the json data from a get request, instead of a json being stored here locally
angular.module('foo').factory('SearchResults', function() {
  
  //Here's Twit
  var Twit = requires('twit');
  var config = requires('./config/config.js');
  var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
  });

  //searchResults is a function that executes the get request via Twit, and should return a json doc
  var searchResults = function(query){
    T.get('search/tweets', {q: query, count: 100}, function(err, data, response) {
      console.log(data)
    })
  };

  //we want the statuses from the returned json
  return searchResults.data.statuses;
});
