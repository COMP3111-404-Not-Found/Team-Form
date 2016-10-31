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
.controller('IndexCtrl', function($scope, $firebaseObject, $firebaseArray, $window) {
    initializeFirebase();

    // logout function
    $scope.logout = function() {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log('sign-out successful');
            $window.open('/login.html', '_self');
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
});
