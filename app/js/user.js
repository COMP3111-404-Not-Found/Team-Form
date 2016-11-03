angular.module('teamform-user-app', ['firebase', 'ngMaterial'])
.controller('UserCtrl', function($scope, $firebaseObject, $firebaseArray) {
    initializeFirebase();
});
