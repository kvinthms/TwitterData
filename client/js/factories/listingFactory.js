angular.module('listings', []).factory('Listings', function($http) {
  var methods = {
    getAll: function() {
      return $http.get('https://polar-cove-30565.herokuapp.com/api/listings');
    },
	
	create: function(listing) {
	  return $http.post('https://polar-cove-30565.herokuapp.com/api/listings', listing);
    }, 

    delete: function(id) {
        return $http.delete('https://polar-cove-30565.herokuapp.com/api/listings/' + id);


    }
  };

  return methods;
});
