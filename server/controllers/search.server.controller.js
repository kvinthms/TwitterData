//This largely follows the format of our HolyGrail, should find a way to rewrite functions by end of Sprint3

var Twitter = require('twitter');

var chirp;

var client = new Twitter({
    consumer_key: '0Ce89vEhtDVJRrznQRs13kVnQ';
    consumer_secret: 'RceoBEhRvmGWioysz5PrDDGgv1OhKlITmbKkjEIpJZTxc6BZZM';
    access_token: '1070800768230400001-S7sB9x9emGcGJeNPQHOp6xaCUxLqMl';
    access_token_secret: 'V7djS4GQmrl3d2soJEm0T30KSev6bpP15i7fJ4dFemNuF';
});

//geocoder api
var ng = require('node-geocoder');

var options = {
    provider: 'opencage',
    httpAdapter: 'https',
    apiKey: 'AIzaSyDLV-_01R5Xdn00IuyLpJdG_1nnkqTyq2c',
    formatter: null
};

var geo = ng(options);

function getwoeid(input) {
    let promise = new Promise(function (resolve, reject) {
        client.get('trends/available', function (err, res) {
            if(err){
                console.log(err);
                reject(err);
                throw err;
            }
            for (let i=0; i<res.length; i++){
                if(res[i].name == userInput) {
                    console.log("woeid: " = res[i].woeid);
                    resolve(res[i].woeid);
                }
            };
            resolve(-1);
        });
    })
    return promise;
}

function sort(criteria){
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


exports.trendsByLoc = function (req, res, next) {
    getwoeid(req.params.userPlace).then(woeid => {
        console.log(woeid);
        if (woeid != -1) {
            client.get('trends/place', {id: woeid}, function(err, resp) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                chirp = resp;
                chirp[0].trends.sort(sort("tweet_volume"));
                return res.status(200).json(chirp);
            });
        }
        else {
            return res.status(200).json("Location Not Found.")
        }
    });
}

function latLong(area) {
    let promise = new Promise(function (resolve, reject) {
        geo.geocode(area, function(err, res) {
            if(err){
                console.log(err);
                resolve(-1);
            }
            var lat = res[0].latitude,
                long = res[0].longitude,
                pair = {
                    latitude: lat,
                    longitude: long
                };
                resolve(pair);
        });
    })
    return promise;
}

function hashtag(topic2, hash){
    let promise = new Promise(function(resolve, reject){
        if(hash === "true"){
            topic2 = "#" + topic2;
        }
        resolve(topic2);
    })
    return promise;
}

exports.tweetsByQ = function(req, res, next){
    var topic = req.params.topic;
    var isHash = req.params.isHash;

    hashtag(topic, isHash).then(function(topic2){
        console.log(topic2);
        var Q = " -RT " + topic2;
        console.log(Q);
        client.get('search/tweets', {q: Q, result_type: 'popular'}, function(err, resp){
            if(err){
                console.log(err);
                return res.status(200).json("failed to get tweet data");
            }
            if(resp.statuses.length == 0){
                console.log("nothing here");
                return res.status(200).json("nothing here");
            }
            return res.status(200).json(resp);
        });
    });
}







