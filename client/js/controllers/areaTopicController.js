angular.module('twitter').controller('areaTopicController', ['$scope', 'Twitter', 
	($scope, Twitter) => {
		var responseData, lineGraph, barGraphTweets, barGraphUsers = null;
		var barUrls = [];
		var lineUrls = [];
		var place = sessionStorage.getItem('place');
		var topic = sessionStorage.getItem('topic');

		if (!place && !topic) {
			console.log("no session storage!");
			$window.location.href = '../../index.html';
			return;
		}

		if (!place){
			$scope.areaSearch = false;
			$scope.topic = topic;
			Twitter.trendTopic(topic).then((response) => {
				if(response.data == "no tweets here"){
					console.log("no tweets");
					emptyData();
					return;
				}
				responseData = response.data.statuses;
				$scope.barTweetsFavorites();
				favBarClick();
				$scope.lineRetweets();
				lineClick();
				$scope.barUsersFollowers();
				userBarClick();
			});
		}
		else{
			$scope.areaSearch = true;
			$scope.topic = topic;
			$scope.place = place;
			Twitter.areaTopic(place, topic).then((response) => {
				if(response.data == "no tweets here"){
					console.log("no tweets");
					emptyData();
					return;
				}
				responseData = response.data.statuses;
				$scope.barTweetsFavorites();
				favBarClick();
				$scope.lineRetweets();
				lineClick();
				$scope.barUsersFollowers();
				userBarClick();
			});
		}

		function sorting(sortParam) {
			return function (a, b) {
				if(a[sortParam] < b[sortParam]) {
					return 1;
				}
				else if (a[sortParam] > b[sortParam]) {
					return -1;
				}
				return 0;
			}
		}

		function emptyData(){
			var no_result = document.getElementsByClassName("no-result");
			for (var i=0; i<no_result.length; i++){
				no_result[i].style.display = "block";
			}
			var yes_result = document.getElementsByClassName("yes-result");
			yes_result[0].style.display = "none";
			var toggle_btns = document.getElementsByClassName("hide-btn");
			for(var i=0; i<toggle_btns.length; i++){
				toggle_btns[i].style.display="none";
			}
			return;
		}

		$scope.barTweetsFavorites = function() {
			responseData.sort(sorting("favorite_count"));
			var labelName = [], labelPop = [];
			var tweetAmount = responseData.length;
			var firstZero = -1;
			if (tweetAmount >= 10){
				tweetAmount = 10;
				for (var i=0; i<10; i++){
					labelPop[i] = responseData[i].favorite_count;
					barUrls[i] = "https://twitter.com/"+ responseData[i].user.screen_name + "/statuses/" + responseData[i].id_str;
					if (firstZero == -1 && responseData[i].favorite_count == 0) {
						firstZero = i;
					}
				}
			}
			else{
				for (var i=0; i<tweetAmount; i++){
					labelPop[i] = responseData[i].favorite_count;
					barUrls[i] = "https://twitter.com/" + responseData[i].user.screen_name + "/statuses/" + responseData[i].id_str;
					if (firstZero == -1 && responseData[i].favorite_count==0){
						firstZero = i;
					}
				}
			}

			if (firstZero == 0) {
				console.log("No top tweets");
			}
			if (firstZero != -1){
				for (var i=0; i<firstZero; i++){
					var num = i + 1;
					labelName[i] = "#" + num;
				}
			}
			else{
				for (var i=0; i<tweetAmount; i++){
					var num = i+1;
					labelName[i] = "#" + num;
				}
			}

			var ctx = document.getElementById('top-tweets').getContext('2d');
			if(!barGraphTweets){
				braGraphTweets = new Chart(ctx, {
					type: 'bar',
					data: {
						labels: labelName,
						datasets: [{
							label: 'Favorites',
							backgroundColor: 'rgb(255, 99, 132)',
							borderColor: 'rgb(255, 99, 132)',
							data: labelPop,
							display: true
						}]
					},

					options: {
						scales: {
							xAxes: [{
								scaleLabel: {
									display: true,
									labelString: "Top Tweets"
								}
							}],
							yAxes: [{
								scaleLabel:{
									display: true,
									labelString: '# of Favorites'
								}
							}]
						}
					}
				});
			}
			else{
				barGraphTweets.data.datasets[0].data = labelPop;
				barGraphTweets.data.labels = labelName;
				barGraphTweets.options.scales.yAxes[0].scaleLabel.labelString = "# of Favorites";
				barGraphTweets.data.datasets[0].label = "Favorites";
				bargraphTweets.update();
			}
		}

		$scope.barTweetsRetweets = function(){
			responseData.sort(sorting("retweet_count"));
			var labelName = [], labelPop = [];
			var tweetAmount = responseData.length;
			var firstZero = -1;
			if (tweetAmount >= 10){
				tweetAmount = 10;
				for (var i=0; i<10; i++){
					labelPop[i] = responseData[i].retweet_count;
					barUrls[i] = "https://twitter.com/" + responseData[i].user.screen_name + "/statuses/" + responseData[i].id_str;
					if (firstZero == -1 && responseData[i].retweet_count == 0){
						firstZero = i;
					}
				}
			}
			else {
				for (var i=0; i<tweetAmount; i++){
					labelPop[i] = responseData[i].retweet_count;
					barUrls[i] = "https://twitter.com/" + responseData[i].user.screen_name + "/statuses/" + responseData[i].id_str;
					if (firstZero == -1 && responseData[i].retweet_count == 0) {
						firstZero = i;
					}
				}
			}

			if (firstZero == 0){
				console.log("No top tweets");
			}
			if (firstZero != -1) {
				for (var i=0; i<firstZero; i++){
					var num = i + 1;
					labelName[i] = "#" + num;
				}
			}
			else{
				for (var i=0; i<tweetAmount; i++){
					var num = i+1;
					labelName[i] = "#" + num;
				}
			}

			barGraphTweets.data.datasets[0].data = labelPop;
			barGraphTweets.data.labels = labelName;
			barGraphTweets.options.scales.yAxes[0].scaleLabel.labelString = "# of Retweets"
			barGraphTweets.data.datasets[0].label = "Retweets";
			barGraphTweets.update();
		}

		$scope.lineFavorites = function(){
			var yAxis = [], xAxis = [];
			let filteredResult = responseData.filter(val => val.favorite_count !== 0).sort((a, b) => { return new Date(a.created_at) - new Date(b.created_at) })

			for (let i=0; i<filteredResult.length; i++){
				if(i==10){
					break;
				}
				yAxis[i] = filteredResult[i].favorite_count;
				let dateCreated = new Date(filteredResult[i].created_at);
				xAxis[i] = `${(dateCreated.getHours() % 12)}:${dateCreated.getMinutes()}:${dateCreated.getSeconds()} ${dateCreated.getHours() >= 12 ? "PM" : "AM"}`;
			}

			lineGraph.data.datasets[0].data = yAxis;
			lineGraph.data.labels = xAxis;
			lineGraph.options.scales.yAxes[0].scaleLabel.labelString = "# of Favorites"
			lineGraph.data.datasets[0].label = "Favorites";
			lineGraph.update();
		}

		$scope.lineRetweets = function(){
			var ctx = $('#line-graph').get(0).getContext('2d');
			let yAxis = [], xAxis = [];
			let filteredResult = responseData.filter(val => val.retweet_count !== 0).sort((a, b) => { return new Date(a.created_at) - new Date(b.created_at) });
			for (let i=0; i<filteredResult.length; i++) {
				if(i==10){
					break;
				}
				yAxis[i] = filteredResult[i].retweet_count;
				let dateCreated = new Date(filteredResult[i].created_at);
				xAxis[i] = `${(dateCreated.getHours() % 12)}:${datecreated.getMinutes()}:${dateCreated.getSeconds()} ${dateCreated.getHours() >= 12 ? "PM" : "AM"}`;
			}

			if (lineGraph == null) {
				lineGraph = new Chart(ctx, {
					type: 'line',
					data: {
						labels: xAxis, 
						datasets: [{
							label: "Retweets", 
							backgroundColor = 'rgb(255, 99, 132)',
							borderColor: 'rgb(255, 99, 132)',
							data: yAxis,
							display: true
						}]
					},
					options: {
						scales: {
							xAxes: [{
								scaleLabel: {
									display: true, 
									labelString: "Trends (time)"
								}
							}],
							yAxes: [{
								scaleLabel: {
									display: true,
									labelstring: "# of Retweets"
								}
							}]
						}
					}
				})
			}
			else{
				lineGraph.data.datasets[0].data = yAxis;
				lineGraph.data.labels = xAxis;
				lineGraph.options.scales.yAxes[0].scaleLabel.labelstring = "# of Retweets"
				lineGraph.data.datasets[0].label = "Retweets";
				lineGraph.update();
			}
		}

		$scope.barUsersFollowers = function(){
			responseData.sort((a, b) => parseFloat(b.user.followers_count) - parseFloat(a.user.followers_count));
			var newResponse = JSON.parse(JSON.stringify(responseData));
			var cap = newResponse.length;
			for(var i=1; i<cap; i++){
				if (newResponse[i].user.screen_name == newResponse[i-1].user.screen_name){
					newResponse.splice(i, 1);
					cap--;
					i--;
				}
			}
			var labelName = [], labelPop = [];
			var userAmount = newResponse.length;
			var firstZero = -1;
			if(userAmount >= 10){
				userAmount = 10;
				for (var i=0; i<10; i++){
					labelName[i] = "@" + newResponse[i].user.screen_name;
					labelPop[i] = newResponse[i].user.followers_count;
					if (firstZero == -1 && newResponse[i].user.followers_count == 0){
						firstZero = i;
					}
				}
			}
			else{
				for (var i=0; i<userAmount; i++){
					labelName[i] = "@" + newResponse[i].user.screen_name;
					labelPop[i] = newResponse[i].user.followers_count;
					if(firstZero == -1 && newResponse[i].user.followers_count == 0){
						firstZero = i;
					}
				}
			}
			var ctx = document.getElementById('top-users').getContext('2d');
			if(!barGraphUsers){
				barGraphUsers = new Chart(ctx, {
					type: 'bar',

					data: {
						labels: labelnaem,
						datasets: [{
							label: 'Top Users by Followers',
							backgroundColor: 'rgb (255, 99, 132)',
							borderColor: 'rgb (255, 99, 132)',
							data: labelPop,
							display: true
						}]
					},

					options: {
						scales: {
							xAxes: [{
								scaleLabel: {
									display: true,
									labelString: "Users"
								}
							}],
							yAxes: [{
								scaleLabel:
								{
									display: true,
									labelString: "# of Followers"
								}
							}]
						}
					}
				});
			}
			else{
				barGraphUsers.data.datasets[0].data = labelPop;
				barGraphUsers.data.labels = labelName;
				barGraphUsers.options.scales.yAxes[0].scaleLabel.labelString = "# of Followers";
				barGraphUsers.data.datasets[0].label = "Top Users by Followers";
				barGraphUsers.update();
			}
		}

		$scope.barUsersTweets = function(){
			responseData.sort((a, b) => parseFloat(b.user.statuses_count)-parseFloat(a.user.statuses_count));
			var newResponse = JSON.parse(JSON.stringify(responseData));
			var cap = newResponse.length;
			for(var i=1; i<cap; i++){
				if(newResponse[i].user.screen_name == newResponse[i-1].user.screen_name){
					newResponse.splice(i, 1);
					cap--;
					i--;
				}
			}

			var labelName = [], labelPop = [];
			var userAmount = newResponse.length;
			var firstZero = -1;
			if (userAmount >= 10){
				userAmount = 10;
				for (var i-0; i<userAmount; i++){
					labelName[i] = "@" + newResponse[i].user.screen_name;
					labelPop[i] = newResponse[i].user.statuses_count;
					if (firstZero == -1 && newResponse[i].user.statuses_count == 0) {
						firstZero = i;
					}
				}
			}

			barGraphUsers.data.datasets[0].data = labelPop;
			barGraphUsers.data.labels = labelName;
			barGraphUsers.options.scales.yAxes[0].scaleLabel.labelString = "# of Tweets";
			barGraphUsers.data.datasets[0].label = "Top Users by Tweet Count";
			barGraphUsers.update();
		}

		function favBarClick(){
			document.getElementById('top-tweets').addEventListener('click', function(event){
				if(barGraphTweets.getElementeAtEvent(event).length == 0){
					console.log("clicked on unimportant area");
				}
				else{
					var index = barGraphTweets.getElementeAtEvent(event)[0]._model.label;
					index = index.substring(1);
					window.open(barUrls[index-1]);
				}
			}, false);
		}
	}
]);























