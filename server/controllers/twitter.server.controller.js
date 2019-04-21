// stuff for twitter api
var Twitter = require('twitter');

var twitter_response;

var client = new Twitter({
    consumer_key: '0Ce89vEhtDVJRrznQRs13kVnQ',
    consumer_secret: 'RceoBEhRvmGWioysz5PrDDGgv1OhKlITmbKkjEIpJZTxc6BZZM',
    access_token_key: '1070800768230400001-S7sB9x9emGcGJeNPQHOp6xaCUxLqMl',
    access_token_secret: 'V7djS4GQmrl3d2soJEm0T30KSev6bpP15i7fJ4dFemNuF'
});


// stuff for geocoder api
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'opencage',
    httpAdapter: 'https',
    apiKey: 'AIzaSyDLV-_01R5Xdn00IuyLpJdG_1nnkqTyq2c',
    formatter: null
};

var geocoder = NodeGeocoder(options);


// functionality


function checkValidArea(userInput) {
    let promise = new Promise(function (resolve, reject) {
        client.get('trends/available', function (error, response) {
            if (error) {
                console.log(error);
                reject(error);
                throw error;
            }
            for (let i = 0; i < response.length; i++) {
                if (response[i].name == userInput) {
                    console.log("found woeid is: " + response[i].woeid);
                    resolve(response[i].woeid);
                }
            };
            resolve(-1);
        });

    })
    return promise;
}


exports.test = (req, res, next) => {
    // return client.get('trends/place', { id: '615702' }, function (error, response) {
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
    return res.status(200).json("Sorry, That location is either not trending or is not valid.");
}


function sorting(sortParam) {
    return function (a, b) {
        if (a[sortParam] < b[sortParam]) {
            return 1;
        }
        else if (a[sortParam] > b[sortParam]) {
            return -1;
        }
        return 0;
    }
}

exports.dynamicTrends = function (req, res, next) {
    console.log("\nin dynamicTrends()!");
    checkValidArea(req.params.userPlace).then(woeid => {
        console.log("Result is " + woeid);
        if (woeid != -1) {
            client.get('trends/place', { id: woeid }, function (error, response) {
                if (error) {
                    console.log(error);
                    throw error;
                }
                twitter_response = response;
                console.log("got info from twitter");

                twitter_response[0].trends.sort(sorting("tweet_volume"));

                return res.status(200).json(twitter_response);
            });
        }
        else {
            return res.status(200).json("Sorry, That location is either not trending or is not valid.");
        }
    });
}

function getCoord(place) {
    let promise = new Promise(function (resolve, reject) {
        geocoder.geocode(place, function (error, response) {
            console.log("getting coords");
            if (error) {
                console.log("could not get place coordinates, error from geocoder api below:");
                console.log(error);
                resolve(-1);
            }
            var lat = response[0].latitude;
            var lon = response[0].longitude;
            var coord = {
                latitude: lat,
                longitude: lon
            };
            console.log("got coords of " + place + ": " + JSON.stringify(coord));
            resolve(coord);
        });
    })
    return promise;
}

exports.areaTopicTweets = function (req, res, next) {
    console.log("\nin areaTopicTweets()!");
    // console.log("in backend with place: " + req.params.place + " and topic: " + req.params.topic + "has hash? " + req.params.isHash);
    var topic = req.params.topic;
    var place = req.params.place;
    var isHash = req.params.isHash;

    if(isHash === "true"){
        topic = "#" + topic;
    }

    getCoord(place).then(function(coord){
        // console.log("got coords: " + coord.latitude + ", " + coord.longitude);
        var searchLocation = coord.latitude+','+coord.longitude+',10mi';
        // console.log("search location: "+searchLocation);
        var searchQuery = " -RT " + topic;
        console.log("search query: " + searchQuery);
        client.get('search/tweets', {q: searchQuery, geocode: searchLocation}, function(error, response){
            if(error){
                console.log("error getting tweet data about trend in specific location");
                return res.status(200).json("could not get tweet data about trend in specific location");
            }
            if(response.statuses.length == 0){
                console.log("no tweets found");
                return res.status(200).json("topic has no tweets to show");
            }
            return res.status(200).json(response);            
        });
        // return res.status(200).json("hi from backend controller with " + place + " and " + topic + " and coords: " + coord);
    });
}

function hashCheck(newTopic, hash){
    let promise = new Promise(function(resolve, reject){
        if(hash === "true"){
            newTopic = "#" + newTopic;
        }
        resolve(newTopic);
    })
    return promise;
}

exports.topicTweets = function(req, res, next){
    console.log("\nin topicTweets()!");
    var topic = req.params.topic;
    var isHash = req.params.isHash;

    hashCheck(topic, isHash).then(function(newTopic){
        console.log("after promise, topic is: " + newTopic);
        var searchQuery = " -RT " + newTopic;
        console.log("searchQuery: " + searchQuery);
        client.get('search/tweets', {q: searchQuery, result_type: 'popular'}, function(error, response){
            if(error){
                console.log("error getting tweet data about trend");
                return res.status(200).json("could not get tweet data about trend");
            }
            if(response.statuses.length == 0){
                console.log("no tweets found");
                return res.status(200).json("topic has no tweets to show");
            }
            return res.status(200).json(response);        
        });
    });

}
