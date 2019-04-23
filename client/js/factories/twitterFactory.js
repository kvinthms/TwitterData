angular.module('twitter').factory('Twitter', function ($http) {
  var methods = {
    getAll: function () {
      return $http.get('https://vast-scrubland-38554.herokuapp.com/api/twitter');
    },

    getTrends: function (userPlace) {
      console.log("got to factory with userPlace: " + userPlace);
      return $http.get('https://vast-scrubland-38554.herokuapp.com/api/twitter/' + userPlace);
    },

    areaTopic: function (place, topic) {
      console.log("Called on init");
      var isHash;
      if (topic[0] == "#") {
        topic = topic.substring(1, topic.length);
        isHash = true;
      }
      else {
        isHash = false;
      }
      return $http.get('https://vast-scrubland-38554.herokuapp.com/api/twitter/topicByArea/' + place + '/' + topic + '/' + isHash);
    },

    trendTopic: function(topic){
      console.log("got to factory with topic: " + topic);
      var isHash;
      if (topic[0] == "#") {
        topic = topic.substring(1, topic.length);
        isHash = true;
      }
      else {
        isHash = false;
      }
      return $http.get('https://vast-scrubland-38554.herokuapp.com/api/twitter/trend/'+topic+'/'+isHash);
    },

    create: function (listing) {
      return $http.post('https://vast-scrubland-38554.herokuapp.com/api/listings', listing);
    },

    delete: function (id) {
      /**TODO
         return result of HTTP delete method
        */
      return $http.delete('https://vast-scrubland-38554.herokuapp.com/api/listings/' + id);
    }
  };

  return methods;
});
