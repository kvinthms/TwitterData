angular.module('TwitterData').controller('TwitterController', ['$scope', '$http', 
  function($scope, Listings) {
    var Twit = requires('twit')
    var config = requires('./config/config.js')
    var T = new Twit({
      consumer_key: config.consumer_key,
      consumer_secret: config.consumer_secret,
      access_token: config.access_token,
      access_token_secret: config.access_token_secret,
    })

    $scope.getTweetsFromQuery = function(query){
      T.Get('search/tweets', {q:query, count: 100}, function(err, data, response){
        console.log(data);
        $scope.search = data; 
        console.log(data);
      })
    };

    $scope.getTrendingFromSelection = function(woeid){
      T.Get(trends/places, {id: woeid}, function(err, data, response){
        console.log(data); 
        $scope.trends = data; 
        console.log(data);
      })
    };
  }
]);