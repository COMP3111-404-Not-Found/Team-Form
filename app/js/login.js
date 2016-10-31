angular.module('teamform-login-app', ['firebase', 'ngMaterial'])
.controller('LoginCtrl', function($scope, $firebaseObject, $firebaseArray, $window) {
    initializeFirebase();

    var provider = new firebase.auth.FacebookAuthProvider();

    // login function
    $scope.login = function() {
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log(user);
            $window.open('/index.html', '_self');
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
        });
    };

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log(user);
        } else {
            // No user is signed in.
            console.log('no user is signed in');
        }
    });
});
