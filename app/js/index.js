$(document).ready(function() {
    $("#btn_admin").click(function() {
        var val = $('#input_text').val();

        if (val !== '') {
            var url = "admin.html?q=" + val;
            window.location.href = url ;
            return false;
        }
    });

    $("#btn_leader").click(function() {
        var val = $('#input_text').val();

        if (val !== '') {
            var url = "team.html?q=" + val;
            window.location.href = url ;
            return false;
        }
    });

    $("#btn_member").click(function() {
        var val = $('#input_text').val();

        if (val !== '') {
            var url = "member.html?q=" + val;
            window.location.href = url ;
            return false;
        }
    });
});

angular.module('teamform-index-app', ['firebase', 'ngMaterial'])
.controller('IndexCtrl', function($scope, $firebaseObject, $firebaseArray) {
    initializeFirebase();


    /* Facebook Authentication */
    var provider = new firebase.auth.FacebookAuthProvider();

    // login function
    $scope.login = function() {
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log(user);
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

    // logout function
    $scope.logout = function() {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log('sign-out successful');
        }, function(error) {
            // An error happened.
            console.log('sign-out error');
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


    /* events */
    var eventRef = firebase.database().ref();

    var eventObj = $firebaseObject(eventRef);
    eventObj.$bindTo($scope, "events");
});
