angular.module('twitter').controller('loginController', ['$scope', 'Twitter', '$window',
  function($scope, Twitter, $window){
  	var checkCreds = function(user, pass){
  		var tryUser = $scope.username;
  		var tryPass = $scope.password;

  		sessionStorage.setItem("user", tryUser);
  		sessionStorage.setItem("pass", tryPass);

  		$window.location.href = "../../index.html"
  	}

  	let user = sessionStorage.getItem('user');
  	let pass = sessionStorage.getItem('pass');
  	if (user != null && pass != null){
  		$scope.username = user;
  		$scope.password = pass;
  		$scope.checkCreds();
  	}

  }]
 );