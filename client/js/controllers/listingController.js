angular.module('foo').controller('TwitterController', ['$scope', 'SearchResults',
  function($scope){
    $scope.searchResults = SearchResults;
  

  var Twit = requires('twit');
  var config = requires('./config/config.js');
  var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
  });

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