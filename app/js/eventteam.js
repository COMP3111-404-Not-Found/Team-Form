angular.module('teamform-eventteam-app', ['firebase', 'ngMaterial'])
.controller('EventTeamCtrl', function($scope, $firebaseObject, $firebaseArray, $window) {
    initializeFirebase();
});
