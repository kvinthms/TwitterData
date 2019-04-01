// default controller, makes user obj available to the view

(function () {
    'use strict';
    angular.module('app').controller('User.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        this.user = null;
        this.saveUser = saveUser;
        this.deleteUser = deleteUser;

        getUser();
        function getUser() {}
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }

    }
);
