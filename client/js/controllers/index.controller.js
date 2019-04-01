// default controller for home section, gets current user
﻿(function () {
    'use strict'; //strict mode
    angular.module('app').controller('Home.IndexController', Controller);
    function Controller(UserService) {
        this.user = null;
        var vm = this;

        getUser();
        function getUser() { //gets the current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }
    }

})();
