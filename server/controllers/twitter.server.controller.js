// stuff for twitter api
var Twitter = require("twitter");

var twitter_response;

var client = new Twitter({
  consumer_key: "0Ce89vEhtDVJRrznQRs13kVnQ",
  consumer_secret: "RceoBEhRvmGWioysz5PrDDGgv1OhKlITmbKkjEIpJZTxc6BZZM",
  access_token_key: "1070800768230400001-S7sB9x9emGcGJeNPQHOp6xaCUxLqMl",
  access_token_secret: "V7djS4GQmrl3d2soJEm0T30KSev6bpP15i7fJ4dFemNuF"
});

//Geocoder API lets us get the WOID and ensure the location being entered is 
// valid before passing it into the API (AND WASTING PRECIOUS API USAGE)
var NodeGeocoder = require("node-geocoder");

var parameters = {
  prov: "opencage",
  Adapter: "https",
  apiKey: "AIzaSyDLV-_01R5Xdn00IuyLpJdG_1nnkqTyq2c",
  formatter: null
};

var geocoder = NodeGeocoder(parameters);

// Implementation of making sure the area is real and exists. 

function ensureAreaExists(userBase) {
  let promise = new Promise(function(resolve, reject) {
    client.get("trends/available", function(error, response) {
      if (error) {
        console.log(error);
        reject(error);
        throw error;
      }
      userBase =
        userBase.charAt(0).toUpperCase() +
        userBase.substring(1).toLowerCase();
      for (let i = 0; i < response.length; i++) {
        if (response[i].name == userBase) {
          console.log("found woeid is: " + response[i].woeid);
          resolve(response[i].woeid);
        }
      }
      resolve(-1);
    });
  });
  return promise;
}

exports.test = (req, res, next) => {
  // return client.get('trends/spotData', { id: '615702' }, function (error, response) {
  //     if (error) {
  //         console.log(error);
  //         throw error;
  //     }
  //     twitter_response = response;
  //     console.log("got info from twitter");

  //     function sortTrends(tweet_volume) {
  //         return function (a, b) {
  //             if (a[tweet_volume] < b[tweet_volume]) {
  //                 return 1;
  //             }
  //             else if (a[tweet_volume] > b[tweet_volume]) {
  //                 return -1;
  //             }
  //             return 0;
  //         }
  //     }
  //     twitter_response[0].trends.sort(sortTrends("tweet_volume"));

  //     return res.status(200).json(twitter_response);
  // });
  return res
    .status(200)
    .json("Sorry, That location is either not trending or is not valid.");
};

function sorting(sortParam) {
  return function(a, b) {
    if (a[sortParam] < b[sortParam]) {
      return 1;
    } else if (a[sortParam] > b[sortParam]) {
      return -1;
    }
    return 0;
  };
}

exports.liveTrends = function(req, res, next) {
  console.log("\nin liveTrends()!");
  ensureAreaExists(req.params.userPlace).then(woeid => {
    console.log("Result is " + woeid);
    if (woeid != -1) {
      client.get("trends/spotData", { id: woeid }, function(error, response) {
        if (error) {
          console.log(error);
          throw error;
        }
        twitter_response = response;
        console.log("got info from twitter");

        twitter_response[0].trends.sort(sorting("tweet_volume"));

        return res.status(200).json(twitter_response);
      });
    } else {
      return res
        .status(200)
        .json("Sorry, That location is either not trending or is not valid.");
    }
  });
};

function getCoord(spotData) {
  let promise = new Promise(function(resolve, reject) {
    geocoder.geocode(spotData, function(error, response) {
      console.log("getting coords");
      if (error) {
        console.log(
          "could not get spotData coordinates, error from geocoder api below:"
        );
        console.log(error);
        resolve(-1);
      }
      var lat = response[0].latitude;
      var lon = response[0].longitude;
      var coord = {
        latitude: lat,
        longitude: lon
      };
      console.log("got coords of " + spotData + ": " + JSON.stringify(coord));
      resolve(coord);
    });
  });
  return promise;
}

exports.geoTopics = function(req, res, next) {
  console.log("\nin geoTopics()!");
  // console.log("in backend with spotData: " + req.params.spotData + " and topic: " + req.params.topic + "has hash? " + req.params.hashCheck);
  var topic = req.params.topic;
  var spotData = req.params.spotData;
  var hashCheck = req.params.hashCheck;

  if (hashCheck === "true") {
    topic = "#" + topic;
  }

  getCoord(spotData).then(function(coord) {
    // console.log("got coords: " + coord.latitude + ", " + coord.longitude);
    var searchLocation = coord.latitude + "," + coord.longitude + ",10mi";
    // console.log("search location: "+searchLocation);
    var searchQuery = " -RT " + topic;
    console.log("search query: " + searchQuery);
    client.get(
      "search/tweets",
      { q: searchQuery, geocode: searchLocation },
      function(error, response) {
        if (error) {
          console.log(
            "error getting tweet data about trend in specific location"
          );
          return res
            .status(200)
            .json("could not get tweet data about trend in specific location");
        }
        if (response.statuses.length == 0) {
          console.log("no tweets found");
          return res.status(200).json("topic has no tweets to show");
        }
        return res.status(200).json(response);
      }
    );
    // return res.status(200).json("hi from backend controller with " + spotData + " and " + topic + " and coords: " + coord);
  });
};

function hashCheck(newTopic, hash) {
  let promise = new Promise(function(resolve, reject) {
    if (hash === "true") {
      newTopic = "#" + newTopic;
    }
    resolve(newTopic);
  });
  return promise;
}

exports.tweetTopics = function(req, res, next) {
  console.log("\nin tweetTopics()!");
  var topic = req.params.topic;
  var hashCheck = req.params.hashCheck;

  hashCheck(topic, hashCheck).then(function(newTopic) {
    console.log("after promise, topic is: " + newTopic);
    var searchQuery = " -RT " + newTopic;
    console.log("searchQuery: " + searchQuery);
    client.get(
      "search/tweets",
      { q: searchQuery, result_type: "popular" },
      function(error, response) {
        if (error) {
          console.log("error getting tweet data about trend");
          return res.status(200).json("could not get tweet data about trend");
        }
        if (response.statuses.length == 0) {
          console.log("no tweets found");
          return res.status(200).json("topic has no tweets to show");
        }
        return res.status(200).json(response);
      }
    );
  });
};
