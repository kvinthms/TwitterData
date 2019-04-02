//I'm gonna be honest, I don't think much of this file is copacetic anymore.


//I named the app module 'foo.' If you rename it be sure to rename it in app.js as well.
angular.module('foo').controller('TwitterController', ['$scope', 'SearchResults',
  function($scope){
    /*
    this *should* pull the query from the listingFactory.js file, 
    in a similar vein to what was done in bootcamp 2
    */
    $scope.searchResults = SearchResults;
  
  //twit used for querying
  var Twit = requires('twit');
  var config = requires('./config/config.js');
  var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
  });

  //getTweetsFromQuery reformatted a little to match what I saw online in forums
  //on success, it puts the data into the feed
  //error logs to console
  $scope.getTweetsFromQuery = function(query){
    T.get('search/tweets', {q:query, count: 100})
    .success(function(data){
      $scope.feed = data;
    })
    .error(function(data, status){
      console.error("Failed to load", status, data);
      $scope.feed = { };
    });
  };

  //getTrendingFromSelection reformatted a little to match what I saw online in forums
  //on success, it puts the data into the feed
  //error logs to console
  $scope.getTrendingFromSelection = function(woeid){
    T.get('trends/places', {id:woeid})
    .success(function(data){
      $scope.trends = data;
    })
    .error(function(data, status){
      console.error("failed to load", status, data);
      $scope.trends = { };
    });
  };
}
]);