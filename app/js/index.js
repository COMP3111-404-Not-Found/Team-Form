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

angular.module("teamform-index-app", ["firebase", "ngMaterial"])
.controller("IndexCtrl", function($scope, $firebaseObject, $firebaseArray) {
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


            // update the user's profile
            var userRef = firebase.database().ref().child("users").child(user.uid);
            var userObj = $firebaseObject(userRef);

            userRef.update({name: user.displayName});
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

    $scope.user = null;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log(user);

            // refresh the scope
            $scope.$apply(function() {
                $scope.user = user;
            });
        } else {
            // No user is signed in.
            console.log('no user is signed in');

            // refresh the scope
            $scope.$apply(function() {
                $scope.user = null;
            });
        }
    });


    /* events */
    var eventRef = firebase.database().ref().child("events");

    var eventObj = $firebaseObject(eventRef);
    eventObj.$bindTo($scope, "events");


    // join event function
    $scope.joinEvent = function(eventName) {
        // add the event to the user's profile
        var userEventsRef = firebase.database().ref().child("users").child($scope.user.uid).child("events").child(eventName);

        userEventsRef.update({team: ""});


        var member = {};
        member[$scope.user.uid] = {name: $scope.user.displayName};

        var eventMemberRef = firebase.database().ref().child("events").child(eventName).child("member");
        var eventMemberObj = $firebaseObject(eventMemberRef);

        eventMemberRef.update(member);
    };
});
