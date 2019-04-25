angular.module('twitter').factory('Twitter', function($http){
  
  //methods contains all the methods for handling http requests we will need here
  var methods = {
    getAll: function(){
      return $http.get('http://vast-scrubland-38554.herokuapp.com/api/twitter');
    },

    //runs an http GET request on a place thru the API
    getTrends: function(userPlace){
      return $http.get('http://vast-scrubland-38554.herokuapp.com/api/twitter/'+userPlace);
    },

    //runs an http GET request on a topic based on location thru the API
    areaTopic: function (place, topic) {
      var isHash;
      if (topic[0] == "#") { //looking for hashtag in string
        topic = topic.substring(1); //taking out the hashtag
        isHash = true; //boolean keeps track of what is hashtag
      }
      else {
        isHash = false; //boolean keeps track of what is hashtag
      }
      return $http.get('http://vast-scrubland-38554.herokuapp.com/api/twitter/topicByArea/' + place + '/' + topic + '/' + isHash);
    },


    //runs an http GET request on a topic thru the API
    trendTopic: function(topic){
      var isHash;
      if(topic[0] == "#"){ //looking for hashtag at beginning of string
        topic = topic.substring(1); //taking the hashtag out
        isHash = true; //boolean to keep track of what's a hashtag
      }
      else{
        isHash = false;
      }
      return $http.get('http://vast-scrubland-38554.herokuapp.com/api/twitter/trend/' + topic + '/' + isHash);
    },

    create: function(listing){
      return $http.post('http://vast-scrubland-38554.herokuapp.com/api/listings', listing);
    },

    delete: function(id){
      return $http.delete('http://vast-scrubland-38554.herokuapp.com/api/listings/' + id);
    }
  };

  //allowing methods to be used by the rest of the app
  return methods;
});