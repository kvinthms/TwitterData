angular.module('twitter').controller('TwitterController', ['$scope', 'Twitter', '$window',
  function($scope, Twitter, $window){

    sessionStorage.removeItem("topic");
    sessionStorage.removeItem("place");

    var graphExists = false;
    var chart;
    var searchNumber = false;
    var canvas = document.getElementById("test-chart");

    canvas.addEventListener('click', clickHndlr, false);
    function clickHndlr(event) {
      var selected = chart.getElementAtEvent(event);
      if (selected.length == 0){
        console.log("clicked on unimportant area");
      }
      else {
        console.log("trend is " + selected[0]._model.label);
        sessionStorage.setItem("topic", selected[0]._model.label);
        $window.location.href = '../../datapage_template.html';
      }
    };

    $scope.searchTrend = function(){
      var userInput = $scope.userPlace;

      if (!searchNumber) {
        sessionStorage.setItem("topic", userInput);
        sessionStorage.removeItem("place");
        $window.location.href = "../../datapage_template.html";
      }
      else{
        sessionStorage.setItem("place", userInput);
        Twitter.getTrends(userInput).then(function (response) {
          if (graphExists) {
            var tmpChart = chart;
            chart = null;
            tmpChart.destroy();
          }
          $scope.listings = response.data;
          if ($scope.listings == "Location Not Found.") {
            graphExists = false;
            document.getElementById('no-results').style.display = "block";
          }
          else{
            document.getElementById('no-results').style.display = "none";
            var labelName = [], 
                labelPop = [];
            for (var i=0; i<10; i++){
              labelName[i] = $scope.listings[0].trends[i].name;
              labelPop[i] = $scope.listings[0].trends[i].tweet_volume;
            }
            var ctx = document.getElementById('test-chart').getContext('2d');
            chart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: labelName,
                datasets: [{
                  label: 'Trending Topics in ' + $scope.listings[0].locations[0].name,
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  data: labelPop,
                  display: true
                }]
              },

              options: {
                scales: {
                  xAxes: [{
                    scaleLabel:
                    {
                      display: true,
                      labelString: "Trends"
                    }
                  }],
                  yAxes: [{
                    scaleLabel:
                    {
                      display: true,
                      labelString: "Tweet Volume"
                    }
                  }]
                }
              }
            });
            graphExists = true;
          }
        }, function (error){
          console.log('Unable to get listings: ', error);
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