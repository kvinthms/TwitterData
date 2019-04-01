var Twit = requires('twit')
var config = requires('./config/config.js')
var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret,
})

function getTweetsFromQuery(query){
    T.Get('search/tweets', {q:query, count: 100}, function(err, data, response){
        console.log(data);
	$scope.search = data; 
    })
}
