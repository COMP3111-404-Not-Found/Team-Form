angular.module('teamform-about-app', ['firebase', 'ngMaterial'])
.controller('AboutCtrl', function($scope, $firebaseObject, $firebaseArray) {
    initializeFirebase();

    var aboutRef = firebase.database().ref().child("about");
    $scope.team = $firebaseObject(aboutRef);
})
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('orange')
    .accentPalette('indigo');
});
