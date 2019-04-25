angular.module('twitter').controller('TwitterController', ['$scope', 'Twitter', '$window',
  function($scope, Twitter, $window){

    sessionStorage.removeItem("topic");
    sessionStorage.removeItem("place");
    $scope.loading = false;
    var graphExists = false;
    var chart;
    var searchNumber = false;
    var canvas = document.getElementById("test-chart");
    canvas.addEventListener('click', clickHndlr, false);
    function clickHndlr(event) {
      var selected = chart.getElementAtEvent(event);
      if (selected.length == 0) {
        console.log("clicked on unimportant area");
      }
      else {
        console.log("trend is " + selected[0]._model.label);
        sessionStorage.setItem("topic", selected[0]._model.label);
        $window.location.href = '../../topic.html';
      }
    };

    $scope.searchTrend = function () {
      var userInput = $scope.userPlace;

      if (!searchNumber) {
        sessionStorage.setItem("topic", userInput);
        sessionStorage.removeItem("place");
        $window.location.href = "../../topic.html";
      }
      else {
        $scope.loading = true;
        sessionStorage.setItem("place", userInput);
        Twitter.getTrends(userInput).then(function (response) {
          $scope.loading = false;
          if (graphExists) {
            var tmpChart = chart;
            chart = null;
            tmpChart.destroy();
          }
          $scope.listings = response.data;
          if ($scope.listings == "Sorry, That location is either not trending or is not valid.") {
            graphExists = false;
            document.getElementById('no-results').style.display = "block";
          }
          else {
            document.getElementById('no-results').style.display = "none";
            //console.log($scope.listings[0].trends[3]);
            var labelName = [], labelPop = [];
            for (var i = 0; i < 10; i++) {
              labelName[i] = $scope.listings[0].trends[i].name;
              labelPop[i] = $scope.listings[0].trends[i].tweet_volume;
            }
            //console.log($scope.listings.length);
            //console.log("Trends in " + $scope.listings[0].locations[0].name);
            var ctx = document.getElementById('test-chart').getContext('2d');
            chart = new Chart(ctx, {
              // The type of chart we want to create
              type: 'horizontalBar',

              // The data for our dataset
              data: {
                labels: labelName,
                datasets: [{
                  backgroundColor: 'rgba(71,160,235,0.5)',
                  borderColor: 'rgb(71, 160, 235)',
                  borderWidth: 1,
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
                      labelString: "Tweets"
                    }
                  }],
                  yAxes: [{
                    scaleLabel:
                    {
                      display: true,
                      labelString: "Topics"
                    }
                  }]
                },
                legend: {
                  display: false
                }
              }
            });
            graphExists = true;
          }
        }, function (error) {
          console.log('Unable to retrieve listings: ', error);
        });


      }
    };


    let place = sessionStorage.getItem('place');
    if (place != null) {
      $scope.userPlace = place;
      $scope.searchTrend();
    }

    $scope.setSearch = function (number) {
      searchNumber = number;
    }
  }
]);
