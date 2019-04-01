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
      T.Get('search/tweets', {q:query, count: 100})
      .success(function(data){
        $scope.search = data;
      })
      .error(function(data, status){
        console.error("Failed to load", status, data);
        $scope.search = { }; 
      });
    };

    $scope.getTrendingFromSelection = function(woeid){
      T.Get('trends/places', {id: woeid})
      .success(function(data){
        $scope.search = data;
      })
      .error(function(data, status){
        console.error("Failed to load", status, data);
        $scope.search = { }; 
      });
    };
  }
]);