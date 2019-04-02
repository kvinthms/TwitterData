angular.module('foo', []).factory('SearchResults', function() {
  var Twit = requires('twit');
  var config = requires('./config/config.js');
  var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
  });

  var searchResults = function(query){
    T.get('search/tweets', {q: query, count: 100}, function(err, data, response) {
      console.log(data)
    })
  };

  return searchResults.data;
});
