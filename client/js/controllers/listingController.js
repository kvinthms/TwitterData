angular.module('listings').controller('ListingsController', ['$scope', 'Listings', 
  function($scope, Listings) {
    /* Get all the listings, then bind it to the scope */
    Listings.getAll().then(function(response) {
      $scope.listings = response.data;
    }, function(error) {
      console.log('Unable to retrieve listings:', error);
    });

    $scope.detailedInfo = undefined;

    $scope.addListing = function() {
        //This code from bootcamp 2
        Listings.create($scope.newListing).then(function(response) {
            $scope.listings.push(
                //response.data
                $scope.newListing);
                location.reload();
        }, function (error) {
            console.log('Unable to retrieve listings:', error);
        });

    };

    $scope.deleteListing = function(id) {

        console.log(id);
       Listings.delete(id).then(function(res){
           console.log("in delete");

           if (res.status == 200) {
               for(var i = 0; i< $scope.listings.length; i++) {
                   console.log("in for");
                   if (res.data.code == $scope.listings[i].code) {
                       console.log("in if");
                       $scope.listings.splice(i, 1);
                   }
               }
           }
           console.log("works");

       }, function(error) {
           console.log('ERROR', error);
       });

    };

    $scope.showDetails = function(index) {
      $scope.detailedInfo = $scope.listings[index];
    };
  }
]);