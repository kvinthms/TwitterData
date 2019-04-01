(function () {
    'use strict';

    angular.module('app', ['ui.router']).config(config).run(run);

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");

        $stateProvider //declaring states aka a "place" for navigating
            .state('user', {
                url: '/user',
                templateUrl: 'user/index.html',
                controller: 'User.IndexController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'user'
                }
            })
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: {
                    activeTab: 'home'
                }
            });


    }

    function run($http, $rootScope, $window) {
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();
