angular.module('twitter').controller('loginController', ['$scope', 'Twitter', '$window',
  function($scope, Twitter, $window){
  	var checkCreds = function(user, pass){
  		var tryUser = $scope.username;
  		var tryPass = $scope.password;

  		sessionStorage.setItem("user", tryUser);
  		sessionStorage.setItem("pass", tryPass);

  		$window.location.href = "../../index.html"
  	};

  	let user = sessionStorage.getItem('user');
  	let pass = sessionStorage.getItem('pass');
  	if (user != null && pass != null){
  		$scope.username = user;
  		$scope.password = pass;
  		$scope.checkCreds();
  	}

  	$scope.login = function() {
  		Twitter.login($scope.login.user, $scope.login.pass).then(function(res) {
  			if(res.status != 200) {
  				alert('Login Failed: Retry with a different username/password combination');
			}
  		});
	};

  	$scope.register = function() {
  		Twitter.register($scope.register.user, $scope.register.pass).then(function(res) {
  			if (res.status == 200) {
  				alert('Registration created');
			} else {
  				alert('Invalid Registration');
			}
		});
	};

  }]
 );