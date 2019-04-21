angular.module('twitter').controller('areaTopicController', ['$scope', 'Twitter',
    ($scope, Twitter) => {

        var responseData, lineGraph, barGraphTweets, barGraphUsers = null;
        var barUrls = [];
        var lineUrls = [];
        var place = sessionStorage.getItem('place');
        var topic = sessionStorage.getItem('topic');
        $scope.loading = true;
        if (!place && !topic) {
            console.log("no session storage!");
            $window.location.href = '../../index.html';   
            return;
        }



        if(!place){
            // topicOnly(topic);
            $scope.areaSearch = false;
            $scope.topic = topic;

            Twitter.trendTopic(topic).then((response) => {
                if(response.data == "topic has no tweets to show"){
                    console.log("yeah no tweets to show");
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
            }).finally(()=>{
                $scope.loading = false;
            });

        }
        else{
            // topicAndArea(place, topic);
            $scope.areaSearch = true;
            $scope.topic = topic;
            $scope.place = place;
            Twitter.areaTopic(place, topic).then((response) => {
                // console.log(response);
                if(response.data == "topic has no tweets to show"){
                    console.log("yeah no tweets to show");
                    emptyData();
                    return;
                }
                // console.log("Called this on init with values " + place + " and " + topic);
                responseData = response.data.statuses;
                $scope.barTweetsFavorites();
                favBarClick();
                $scope.lineRetweets();
                lineClick();
                $scope.barUsersFollowers();
                userBarClick();
            }).finally(()=>{
                $scope.loading = false;
            });
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

            function emptyData(){
                console.log("in the emptyData function");
                var no_result = document.getElementsByClassName("no-result");
                for(var i = 0; i < no_result.length; i++){
                    no_result[i].style.display="block";
                }
                var yes_result = document.getElementsByClassName("yes-result");
                yes_result[0].style.display="none";

                var toggle_btns = document.getElementsByClassName("hide-btn");
                for(var i = 0; i < toggle_btns.length; i++){
                    toggle_btns[i].style.display="none";
                }
                return;
            }

            $scope.barTweetsFavorites = function() {
                responseData.sort(sorting("favorite_count"));
                var labelName = [], labelPop = [];
                var tweetAmount = responseData.length;
                var firstZero = -1;
                if (tweetAmount >= 10) {
                    tweetAmount = 10;
                    for (var i = 0; i < 10; i++) {
                        // labelName[i] = "#"+i;
                        labelPop[i] = responseData[i].favorite_count;
                        barUrls[i] = "https://twitter.com/" + responseData[i].user.screen_name + "/statuses/" + responseData[i].id_str;
                        // console.log("https://twitter.com/" + responseData[i].user.screen_name + "/statuses/" + responseData[i].id_str);
                        if (firstZero == -1 && responseData[i].favorite_count == 0) {
                            firstZero = i;
                        }
                    }
                }
                else {
                    for (var i = 0; i < tweetAmount; i++) {
                        // labelName[i] = "#"+i;
                        labelPop[i] = responseData[i].favorite_count;
                        barUrls[i] = "https://twitter.com/" + responseData[i].user.screen_name + "/statuses/" + responseData[i].id_str;
                        if (firstZero == -1 && responseData[i].favorite_count == 0) {
                            firstZero = i;
                        }
                    }
                }

                // console.log(labelPop);
                // console.log(labelName);
                // console.log("first zero: " + firstZero);

                if (firstZero == 0) {
                    console.log("No top tweets");
                    // return;
                }
                if (firstZero != -1) {
                    for (var i = 0; i < firstZero; i++) {
                        var num = i + 1;
                        labelName[i] = "#" + num;
                    }
                }
                else {
                    for (var i = 0; i < tweetAmount; i++) {
                        var num = i + 1;
                        labelName[i] = "#" + num;
                    }
                }

                var ctx = document.getElementById('top-tweets').getContext('2d');
                if(!barGraphTweets){
                    barGraphTweets = new Chart(ctx, {
                        // The type of chart we want to create
                        type: 'bar',

                        // The data for our dataset
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

                        // Configuration options go here
                        options: {
                            scales: {
                                xAxes: [{
                                    scaleLabel:
                                    {
                                        display: true,
                                        labelString: "Top Tweets"
                                    }
                                }],
                                yAxes: [{
                                    scaleLabel:
                                    {
                                        display: true,
                                        labelString: "# of Favorites"
                                    }
                                }]
                            }
                        }
                    });
                }
                else{
                    // ??????
                    barGraphTweets.data.datasets[0].data = labelPop;
                    barGraphTweets.data.labels = labelName;
                    barGraphTweets.options.scales.yAxes[0].scaleLabel.labelString = "# of Favorites"
                    barGraphTweets.data.datasets[0].label = "Favorites";

                    barGraphTweets.data.datasets[0].backgroundColor = 'rgb(255, 99, 132)';
                    barGraphTweets.data.datasets[0].borderColor = 'rgb(255, 99, 132)';
                    barGraphTweets.update();
                }

            }

            $scope.barTweetsRetweets = function(){
                responseData.sort(sorting("retweet_count"));
                var labelName = [], labelPop = [];
                var tweetAmount = responseData.length;
                var firstZero = -1;
                if (tweetAmount >= 10) {
                    tweetAmount = 10;
                    for (var i = 0; i < 10; i++) {
                        // labelName[i] = "#"+i;
                        labelPop[i] = responseData[i].retweet_count;
                        barUrls[i] = "https://twitter.com/" + responseData[i].user.screen_name + "/statuses/" + responseData[i].id_str;
                        if (firstZero == -1 && responseData[i].retweet_count == 0) {
                            firstZero = i;
                        }
                    }
                }
                else {
                    for (var i = 0; i < tweetAmount; i++) {
                        // labelName[i] = "#"+i;
                        labelPop[i] = responseData[i].retweet_count;
                        barUrls[i] = "https://twitter.com/" + responseData[i].user.screen_name + "/statuses/" + responseData[i].id_str;
                        if (firstZero == -1 && responseData[i].retweet_count == 0) {
                            firstZero = i;
                        }
                    }
                }

                if (firstZero == 0) {
                    console.log("No top tweets");
                    // return;
                }
                if (firstZero != -1) {
                    for (var i = 0; i < firstZero; i++) {
                        var num = i + 1;
                        labelName[i] = "#" + num;
                    }
                }
                else {
                    for (var i = 0; i < tweetAmount; i++) {
                        var num = i + 1;
                        labelName[i] = "#" + num;
                    }
                }

                barGraphTweets.data.datasets[0].data = labelPop;
                barGraphTweets.data.labels = labelName;
                barGraphTweets.options.scales.yAxes[0].scaleLabel.labelString = "# of Retweets"
                barGraphTweets.data.datasets[0].label = "Retweets";

                barGraphTweets.data.datasets[0].backgroundColor = 'rgb(66,192,251)';
                barGraphTweets.data.datasets[0].borderColor = 'rgb(66,192,251)';

                barGraphTweets.update();

            }

            $scope.lineFavorites = function () {
                var yAxis = [], xAxis = [];
                // let filteredResult = responseData.filter(val => val.favorite_count !== 0).sort((a, b) => { return new Date(a.created_at) - new Date(b.created_at) })

                var filteredResult = JSON.parse(JSON.stringify(responseData));
                filteredResult.sort((a, b) => parseFloat(b.favorite_count) - parseFloat(a.favorite_count));
                filteredResult.splice(10);
                filteredResult.sort((a, b) => { return new Date(a.created_at) - new Date(b.created_at) });

                for (let i = 0; i < filteredResult.length; i++) {
                    if (i == 10) {
                        break;
                    }
                    yAxis[i] = filteredResult[i].favorite_count;
                    let dateCreated = new Date(filteredResult[i].created_at);
                    
                    if(dateCreated.getMinutes().toString().length == 1){
                        // console.log("single digit min");

                        var hour = mod((dateCreated.getUTCHours()-7), 12);
                        if(hour == 0){ 
                            hour = 12;
                        }
                        // console.log("hour: " + hour);
                        var min = dateCreated.getMinutes().toString();
                        min = "0"+min;
                        parseInt(min, 10);
                        // console.log("min: " + min);
                        xAxis[i] = `${hour}:${min}:${dateCreated.getSeconds()} ${dateCreated.getUTCHours()-7 < 0 || dateCreated.getUTCHours()-7 >= 12  ? "PM" : "AM"}`;
                    }
                    else{
                        // console.log("double digit min");
                        var hour = mod((dateCreated.getUTCHours()-7), 12);
                        if(hour == 0){ 
                            hour = 12;
                        }
                        var min = dateCreated.getMinutes();
                        // console.log("hour: "+hour);
                        // console.log("min: "+min);
                        xAxis[i] = `${hour}:${min}:${dateCreated.getSeconds()} ${dateCreated.getUTCHours()-7 < 0 || dateCreated.getUTCHours()-7 >= 12  ? "PM" : "AM"}`;
                    }
                 
                    //fill lineUrls array
                    lineUrls[i] = "https://twitter.com/" + filteredResult[i].user.screen_name + "/statuses/" + filteredResult[i].id_str;
                }
                console.log(filteredResult);
                lineGraph.data.datasets[0].data = yAxis;
                lineGraph.data.labels = xAxis;
                lineGraph.options.scales.yAxes[0].scaleLabel.labelString = "# of Favorites"
                lineGraph.data.datasets[0].label = "Favorites";

                lineGraph.data.datasets[0].backgroundColor = 'rgb(255, 99, 132)';
                lineGraph.data.datasets[0].borderColor = 'rgb(255, 99, 132)';

                lineGraph.update();
            }
            $scope.lineRetweets = function () {
                var ctx = $('#line-graph').get(0).getContext('2d');
                let yAxis = [], xAxis = [];
                // let filteredResult = responseData.filter(val => val.retweet_count !== 0).sort((a, b) => { return new Date(a.created_at) - new Date(b.created_at) });
                
                var filteredResult = JSON.parse(JSON.stringify(responseData));
                // console.log(filteredResult);
                // console.log("sorting by rt: ");
                filteredResult.sort((a, b) => parseFloat(b.retweet_count) - parseFloat(a.retweet_count));
                // console.log(filteredResult);
                filteredResult.splice(10);
                // console.log("removed excess");
                // console.log(filteredResult);
                filteredResult.sort((a, b) => { return new Date(a.created_at) - new Date(b.created_at) });
                // console.log("sort by date");
                // console.log(filteredResult);

                for (let i = 0; i < filteredResult.length; i++) {
                    if (i == 10) {
                        break;
                    }
                    yAxis[i] = filteredResult[i].retweet_count;
                    let dateCreated = new Date(filteredResult[i].created_at);

                    if(dateCreated.getMinutes().toString().length == 1){
                        // console.log("single digit min");

                        var hour = mod((dateCreated.getUTCHours()-7), 12);
                        if(hour == 0){ 
                            hour = 12;
                        }
                        // console.log("hour: " + hour);
                        var min = dateCreated.getMinutes().toString();
                        min = "0"+min;
                        parseInt(min, 10);
                        // console.log("min: " + min);
                        xAxis[i] = `${hour}:${min}:${dateCreated.getSeconds()} ${dateCreated.getUTCHours()-7 < 0 || dateCreated.getUTCHours()-7 >= 12  ? "PM" : "AM"}`;
                    }
                    else{
                        // console.log("double digit min");
                        var hour = mod((dateCreated.getUTCHours()-7), 12);
                        if(hour == 0){ 
                            hour = 12;
                        }
                        var min = dateCreated.getMinutes();
                        // console.log("hour: "+hour);
                        // console.log("min: "+min);
                        xAxis[i] = `${hour}:${min}:${dateCreated.getSeconds()} ${dateCreated.getUTCHours()-7 < 0 || dateCreated.getUTCHours()-7 >= 12  ? "PM" : "AM"}`;
                    }
                    
                    //fill lineUrls array
                    lineUrls[i] = "https://twitter.com/" + filteredResult[i].user.screen_name + "/statuses/" + filteredResult[i].id_str;
                }

                if (lineGraph == null) {
                    lineGraph = new Chart(ctx, {
                        type: 'line',

                        data: {
                            labels: xAxis,
                            datasets: [{
                                label: "Retweets",
                                backgroundColor: 'rgb(66,192,251)',
                                borderColor: 'rgb(66,192,251)',
                                data: yAxis,
                                display: true
                            }]
                        },
                        options: {
                            scales: {
                                xAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Tweet Time (EST)"
                                    }
                                }],
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: "# of Retweets"
                                    }
                                }]
                            }

                        }
                    })
                }
                else {
                    lineGraph.data.datasets[0].data = yAxis;
                    lineGraph.data.labels = xAxis;
                    lineGraph.options.scales.yAxes[0].scaleLabel.labelString = "# of Retweets"
                    lineGraph.data.datasets[0].label = "Retweets";

                    lineGraph.data.datasets[0].backgroundColor = 'rgb(66,192,251)';
                    lineGraph.data.datasets[0].borderColor = 'rgb(66,192,251)';

                    lineGraph.update();
                }
            }
        

            $scope.barUsersFollowers = function(){
                responseData.sort((a, b) => parseFloat(b.user.followers_count) - parseFloat(a.user.followers_count));
                // console.log(responseData);
                //remove duplicate users
                var newResponse = JSON.parse(JSON.stringify(responseData));
                var cap = newResponse.length;
                for(var i = 1; i < cap; i++){
                    if(newResponse[i].user.screen_name == newResponse[i-1].user.screen_name){
                        // console.log("cutting stuff right now!")
                        newResponse.splice(i, 1);    //remove element at ith index
                        cap--;
                        i--;
                    }
                }

                var labelName = [], labelPop = [];
                var userAmount = newResponse.length;
                var firstZero = -1;
                if (userAmount >= 10) {
                    userAmount = 10;
                    for (var i = 0; i < 10; i++) {
                        labelName[i] = "@"+newResponse[i].user.screen_name;
                        labelPop[i] = newResponse[i].user.followers_count;
                        if (firstZero == -1 && newResponse[i].user.followers_count == 0) {
                            firstZero = i;
                        }
                    }
                }
                else {
                    for (var i = 0; i < userAmount; i++) {
                        labelName[i] = "@"+newResponse[i].user.screen_name
                        labelPop[i] = newResponse[i].user.followers_count;
                        if (firstZero == -1 && newResponse[i].user.followers_count == 0) {
                            firstZero = i;
                        }
                    }
                }

                // console.log("\nWith cutting repeating users")
                // console.log(labelPop);
                // console.log(labelName);
                // console.log("first zero: " + firstZero);
                // console.log(newResponse);

                var ctx = document.getElementById('top-users').getContext('2d');
                if(!barGraphUsers){
                    barGraphUsers = new Chart(ctx, {
                        // The type of chart we want to create
                        type: 'bar',

                        // The data for our dataset
                        data: {
                            labels: labelName,
                            datasets: [{
                                label: 'Top Users by Followers',
                                backgroundColor: 'rgb(255, 200, 57)',
                                borderColor: 'rgb(255, 200, 57)',
                                data: labelPop,
                                display: true
                            }]
                        },

                        // Configuration options go here
                        options: {
                            scales: {
                                xAxes: [{
                                    scaleLabel:
                                    {
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
                    // ??????
                    barGraphUsers.data.datasets[0].data = labelPop;
                    barGraphUsers.data.labels = labelName;
                    barGraphUsers.options.scales.yAxes[0].scaleLabel.labelString = "# of Followers"
                    barGraphUsers.data.datasets[0].label = "Top Users by Followers";

                    barGraphUsers.data.datasets[0].backgroundColor = 'rgb(255, 200, 57)';
                    barGraphUsers.data.datasets[0].borderColor = 'rgb(255, 200, 57)';

                    barGraphUsers.update();
                }

            }

            $scope.barUsersTweets = function(){
                responseData.sort((a, b) => parseFloat(b.user.statuses_count) - parseFloat(a.user.statuses_count));
                //remove duplicate users
                var newResponse = JSON.parse(JSON.stringify(responseData));
                var cap = newResponse.length;
                for(var i = 1; i < cap; i++){
                    if(newResponse[i].user.screen_name == newResponse[i-1].user.screen_name){
                        // console.log("cutting stuff right now!")
                        newResponse.splice(i, 1);    //remove element at ith index
                        cap--;
                        i--;
                    }
                }

                var labelName = [], labelPop = [];
                var userAmount = newResponse.length;
                var firstZero = -1;
                if (userAmount >= 10) {
                    userAmount = 10;
                    for (var i = 0; i < 10; i++) {
                        labelName[i] = "@"+newResponse[i].user.screen_name;
                        labelPop[i] = newResponse[i].user.statuses_count;
                        if (firstZero == -1 && newResponse[i].user.statuses_count == 0) {
                            firstZero = i;
                        }
                    }
                }
                else {
                    for (var i = 0; i < userAmount; i++) {
                        labelName[i] = "@"+newResponse[i].user.screen_name;
                        labelPop[i] = newResponse[i].user.statuses_count;
                        if (firstZero == -1 && newResponse[i].user.statuses_count == 0) {
                            firstZero = i;
                        }
                    }
                }

                // console.log("\nWith cutting repeating users")
                // console.log(labelPop);
                // console.log(labelName);
                // console.log("first zero: " + firstZero);
                // console.log(newResponse);

                barGraphUsers.data.datasets[0].data = labelPop;
                barGraphUsers.data.labels = labelName;
                barGraphUsers.options.scales.yAxes[0].scaleLabel.labelString = "# of Tweets"
                barGraphUsers.data.datasets[0].label = "Top Users by Tweet Count";

                barGraphUsers.data.datasets[0].backgroundColor = 'rgb(97, 52, 174)';
                barGraphUsers.data.datasets[0].borderColor = 'rgb(97, 52, 174)';

                barGraphUsers.update();
            }
        //}
        
        function favBarClick(){
            document.getElementById('top-tweets').addEventListener('click', function(event){
                var selected = barGraphTweets.getElementAtEvent(event);
                if (selected.length == 0) {
                    console.log("clicked on unimportant area");
                }
                else {
                    var index = selected[0]._model.label;
                    index = index.substring(1);
                    window.open(barUrls[index-1]);
                }
            }, false);
        }

        function lineClick(){
            document.getElementById('line-graph').addEventListener('click', function(event){
                var selected = lineGraph.getElementAtEvent(event);
                if(selected.length == 0){
                    console.log("clicked on unimportant area");
                }
                else{
                    var index = selected[0]._index;
                    console.log(index);
                    window.open(lineUrls[index]);
                }
            }, false);   
        }

        function userBarClick(){
            document.getElementById('top-users').addEventListener('click', function(event){
                var selected = barGraphUsers.getElementAtEvent(event);
                if (selected.length == 0) {
                    console.log("clicked on unimportant area");
                }
                else {
                    var name = selected[0]._model.label;
                    name = name.substring(1);
                    var url = "https://twitter.com/";
                    window.open(url+name);
                }
            }, false);
        }


        //function needed for modulo :(
        function mod(a, b){
            return ((a % b)+b)%b;
        }

    }
]);
