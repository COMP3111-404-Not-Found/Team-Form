angular.module('teamform-login-app', ['firebase', 'ngMaterial'])
.controller('LoginCtrl', function($scope, $firebaseObject, $firebaseArray) {
    initializeFirebase();
});
