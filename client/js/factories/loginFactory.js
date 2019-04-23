angular.module('twitter').factory('Twitter', function ($http) {

    return {

        login: function (username, pass) {

            var logInfo = {
                user: username,
                hpass: pass
            };

            console.log('Login for: ' + logInfo.user + ' w/ pwd: ' + logInfo.hpass);

            return $http.post('/auth/login/', logInfo).success(function () {

                console.log('Login success');
                window.location.href = '/search';

            });

        },

        register: function (username, pass) {

            var logInfo = {
                user: username,
                hpass: pass
            };

            console.log('Register for: ' + logInfo.user + ' and hash: ' + logInfo.hpass);

            //another attempt
            return $http.post('/auth/register/', logInfo);
        },

    };

});