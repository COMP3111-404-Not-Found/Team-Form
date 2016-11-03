$(document).ready(function() {

});

angular.module('teamform-about-app', ['firebase', 'ngMaterial'])
.controller('AboutCtrl', function($scope, $firebaseObject, $firebaseArray) {
    initializeFirebase();
    $scope.team = [
    	{pic: "steven.jpg", name: "Steven To", email: "clto@ust.hk", information: "Hello!"},
    	{pic: "man.jpg", name: "Man God", email: "ManGod@ust.hk", information: "Hello!!!!!"}
    ];
});