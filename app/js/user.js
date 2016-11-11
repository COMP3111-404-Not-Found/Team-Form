angular.module("teamform-user-app", ["firebase", "ngMaterial"])
.controller("UserCtrl", function($scope, $firebaseObject, $firebaseArray) {
    initializeFirebase();

    $scope.user = null;

    var userRef = null;
    $scope.userObj = null;

    // observe the auth state change
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log(user);

            // refresh the scope
            $scope.$apply(function() {
                $scope.user = user;

                // get the user object from the database
                userRef = firebase.database().ref().child("users").child(user.uid);
                $scope.userObj = $firebaseObject(userRef);

                // change the title in the navigation to the name of the signed in user
                $(".mdl-layout>.mdl-layout__header>.mdl-layout__header-row>.mdl-layout__title").html($scope.user.displayName);
            });
        } else {
            // No user is signed in.
            console.log('no user is signed in');

            // refresh the scope
            $scope.$apply(function() {
                $scope.user = null;

                userRef = null;
                $scope.userObj = null;

                // change the title in the navigation to "User"
                $(".mdl-layout>.mdl-layout__header>.mdl-layout__header-row>.mdl-layout__title").html("User");
            });
        }
    });
})
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('orange')
    .accentPalette('indigo');
});
