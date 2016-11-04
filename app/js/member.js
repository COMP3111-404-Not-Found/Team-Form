$(document).ready(function() {
    $('#member_page_controller').hide();
    $('#text_event_name').text("Error: Invalid event name ");

    var eventName = getURLParameter("q");

    if (eventName != null && eventName !== '' ) {
        $('#text_event_name').text("Event name: " + eventName);
        $('#member_page_controller').show();
    }
});

angular.module('teamform-member-app', ['firebase', 'ngMaterial'])
.controller('MemberCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {

    // TODO: implementation of MemberCtrl

    // Call Firebase initialization code defined in site.js
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
            });
        } else {
            // No user is signed in.
            console.log('no user is signed in');

            // refresh the scope
            $scope.$apply(function() {
                $scope.user = null;

                userRef = null;
                $scope.userObj = null;
            });
        }
    });


    $scope.userID = "";
    $scope.userName = "";
    $scope.teams = {};

    $scope.loadFunc = function() {
        var userID = $scope.userID;
        if ( userID !== '' ) {

            var refPath = getURLParameter("q") + "/member/" + userID;

            retrieveOnceFirebase(firebase, "events/" + refPath, function(data) {

                if (data.child("name").val() != null) {
                    $scope.userName = data.child("name").val();
                } else {
                    $scope.userName = "";
                }

                if (data.child("selection").val() != null) {
                    $scope.selection = data.child("selection").val();
                }
                else {
                    $scope.selection = [];
                }

                $scope.$apply();
            });
        }
    }

    $scope.saveFunc = function() {
        var userID = $.trim( $scope.userID );
        var userName = $.trim( $scope.userName );

        if ( userID !== '' && userName !== '' ) {

            var newData = {
                'name': userName,
                'selection': $scope.selection
            };

            // add the event to the user's profile
            var userEventsRef = firebase.database().ref().child("users").child($scope.user.uid).child("events");
            var userEventsArray = $firebaseArray(userEventsRef);

            userEventsArray.$add(getURLParameter("q"));

            // update the user's profile
            var userRef = firebase.database().ref().child("users").child($scope.user.uid);

            userRef.update(newData);


            var refPath = getURLParameter("q") + "/member/" + userID;
            var ref = firebase.database().ref("events/" + refPath);

            ref.set(newData, function() {
                // complete call back
                //alert("data pushed...");

                // Finally, go back to the front-end
                window.location.href = "index.html";
            });
        }
    }

    $scope.refreshTeams = function() {
        var refPath = getURLParameter("q") + "/team";
        var ref = firebase.database().ref("events/" + refPath);

        // Link and sync a firebase object
        $scope.selection = [];
        $scope.toggleSelection = function(item) {
            var idx = $scope.selection.indexOf(item);
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }
            else {
                $scope.selection.push(item);
            }
        }

        $scope.teams = $firebaseArray(ref);
        $scope.teams.$loaded()
            .then( function(data) {


            })
            .catch(function(error) {
                // Database connection error handling...
                //console.error("Error:", error);
            });
    }

    $scope.refreshTeams(); // call to refresh teams...

}]);
