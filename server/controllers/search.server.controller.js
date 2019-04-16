//This largely follows the format of our HolyGrail, should find a way to rewrite functions by end of Sprint3

var Twitter = require('twitter');

var twitter_response;

var client = new Twitter({
    consumer_key: '0Ce89vEhtDVJRrznQRs13kVnQ';
    consumer_secret: 'RceoBEhRvmGWioysz5PrDDGgv1OhKlITmbKkjEIpJZTxc6BZZM';
    access_token_key: '1070800768230400001-S7sB9x9emGcGJeNPQHOp6xaCUxLqMl';
    access_token_secret: 'V7djS4GQmrl3d2soJEm0T30KSev6bpP15i7fJ4dFemNuF';
});

//geocoder api
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'opencage',
    httpAdapter: 'https',
    apiKey: 'AIzaSyDLV-_01R5Xdn00IuyLpJdG_1nnkqTyq2c',
    formatter: null
};

var geocoder = NodeGeocoder(options);

function checkValidArea(userInput) {
    let promise = new Promise(function (resolve, reject) {
        client.get('trends/available', function (error, response) {
            if(err){
                console.log(err);
                reject(err);
                throw err;
            }
            for (let i=0; i<response.length; i++){
                if(response[i].name == userInput) {
                    console.log("woeid: " = response[i].woeid);
                    resolve(response[i].woeid);
                }
            };
            resolve(-1);
        });
    })
    return promise;
}

function sorting(criteria){
    return function (a, b){
        if(a[criteria] < b[criteria]) {
            return 1;
        }
        else if (a[criteria] > b[criteria]) {
            return -1;
        }
        return 0;
    }
}


exports.dynamicTrends = function (req, res, next) {
    checkValidArea(req.params.userPlace).then(woeid => {
        if (woeid != -1) {
            client.get('trends/place', {id: woeid}, function(err, resp) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                twitter_response = response;
                twitter_response[0].trends.sort(sorting("tweet_volume"));
                return res.status(200).json(twitter_response);
            });
        }
        else {
            return res.status(200).json("Location Not Found.")
        }
    });
}

function getCoord(area) {
    let promise = new Promise(function (resolve, reject) {
        geocoder.geocode(place, function(error, response) {
            if(error){
                console.log(error);
                resolve(-1);
            }
            var lat = res[0].latitude,
                lon = res[0].longitude,
                coord = {
                    latitude: lat,
                    longitude: lon
                };
                resolve(coord);
        });
    })
    return promise;
}

exports.areaTopicTweets = function(req, res, next){
    var topic = req.params.topic;
    var place = req.params.place;
    var isHash = req.params.isHash;

    if(isHash === "true"){
        topic = "#" + topic;
    }

    getCoord(place).then(function(coord){
        var searchLocation = coord.latitude+','+coord.longitude+',10mi';
        var searchQuery = " -RT " + topic;
        client.get('search/tweets', {q: searchQuery, geocode: searchLocation}, function(error, response){
            if(error){
                return res.status(200).json("couldn't get tweet data about trend in location");
            }
            if(response.statuses.length==0){
                return res.status(200).json("no tweets here");
            }
            return res.status(200).json(response);
        });
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
    var topic = req.params.topic;
    var isHash = req.params.isHash;

    hashCheck(topic, isHash).then(function(newTopic){
        console.log(newTopic);
        var searchQuery = " -RT " + newTopic;
        console.log(searchQuery);
        client.get('search/tweets', {q: searchQuery, result_type: 'popular'}, function(error, response){
            if(error){
                console.log(error);
                return res.status(200).json("failed to get tweet data");
            }
            if(response.statuses.length == 0){
                console.log("nothing here");
                return res.status(200).json("nothing here");
            }
            return res.status(200).json(response);
        });
    });
}







