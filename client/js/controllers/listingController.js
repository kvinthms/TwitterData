angular.module('TwitterData').controller('TwitterController', ['$scope', '$http', 
  function($scope, Listings) {
    
    /*
    Using Twit in order to carry out queries and receive the JSON doc with Twitter statuses
    This should cut down on time considerably as the querying is being taken care of externally
    *
    Link to public Twit GitHub Repo: https://github.com/ttezel/twit 
    */
    var Twit = requires('twit')
    var config = requires('./config/config.js')
    var T = new Twit({
      consumer_key: config.consumer_key,
      consumer_secret: config.consumer_secret,
      access_token: config.access_token,
      access_token_secret: config.access_token_secret,
    })

    //this is the method that carries out the query for search-by-keyword
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

    //this is the method that carries out the query for search-by-location
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