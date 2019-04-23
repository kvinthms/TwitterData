angular.module("twitter").factory("Twitter", function($http) {
  var methods = {
    getAll: function() {
      return $http.get("/api/twitter");
    },

    getTrends: function(userPlace) {
      console.log("got to factory with userPlace: " + userPlace);
      return $http.get("/api/twitter/" + userPlace);
    },

    areaTopic: function(spotData, topic) {
      console.log("Called on init");
      var hashCheck;
      if (topic[0] == "#") {
        topic = topic.substring(1, topic.length);
        hashCheck = true;
      } else {
        hashCheck = false;
      }
      return $http.get(
        "/api/twitter/topicByArea/" + spotData + "/" + topic + "/" + hashCheck
      );
    },

    trendTopic: function(topic) {
      console.log("got to factory with topic: " + topic);
      var hashCheck;
      if (topic[0] == "#") {
        topic = topic.substring(1, topic.length);
        hashCheck = true;
      } else {
        hashCheck = false;
      }
      return $http.get("/api/twitter/trend/" + topic + "/" + hashCheck);
    },

    create: function(listing) {
      return $http.post("/api/listings", listing);
    },

    delete: function(id) {
      /**TODO
         return result of HTTP delete method
        */
      return $http.delete("/api/listings/" + id);
    }
  };

  return methods;
});
