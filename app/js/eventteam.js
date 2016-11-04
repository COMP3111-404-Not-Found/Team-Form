angular.module('teamform-eventteam-app', ['firebase', 'ngMaterial'])
.controller('EventTeamCtrl', function($scope, $firebaseObject, $firebaseArray) {
    initializeFirebase();

    $scope.eventName = getURLParameter("event");


    /* teams */
    var teamRef = firebase.database().ref().child("events").child($scope.eventName).child("team");

    var teamObj = $firebaseObject(teamRef);
    teamObj.$bindTo($scope, "teams");
});
