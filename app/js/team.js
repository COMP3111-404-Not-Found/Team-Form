$(document).ready(function() {
    $("#text_event_name").text("Error: Invalid event name");

    var eventName = getURLParameter("event");
    if (eventName != null && eventName !== "") {
        $("#text_event_name").text("Event name: " + eventName);
    }

    var teamName = getURLParameter("team");
    if (teamName !== null && teamName !== "") {
        $("#text_team_name").text("Team name: " + teamName);
    }
});

angular.module("teamform-team-app", ["firebase", "ngMaterial"])
.controller("TeamCtrl", function($scope, $firebaseObject, $firebaseArray) {
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


    // var refPath = "";
    var eventName = getURLParameter("event");
    var teamName = getURLParameter("team");
    var eventRef = firebase.database().ref().child("events").child(eventName);


    var eventAdminParamRef = eventRef.child("admin").child("param");
    var eventAdminParamObj = $firebaseObject(eventAdminParamRef);
    eventAdminParamObj.$loaded().then(function(admin) {
        $scope.minTeamSize = admin.minTeamSize;
        $scope.maxTeamSize = admin.maxTeamSize;
    });


    var eventTeamRef = eventRef.child("team").child(teamName);
    var eventTeamObj = $firebaseObject(eventTeamRef);
    eventTeamObj.$loaded().then(function(team) {
        $scope.size = team.size;
        $scope.currentTeamSize = team.currentTeamSize;
    });

    var eventTeamMembersRef = eventTeamRef.child("teamMembers");
    $scope.members = $firebaseArray(eventTeamMembersRef);

    var skillsRef = eventTeamRef.child("skills");
    $scope.skills = $firebaseArray(skillsRef);


    var eventTeamMemberRequestsRef = eventRef.child("member");
    var eventTeamMemberRequestsArray = $firebaseArray(eventTeamMemberRequestsRef);
    eventTeamMemberRequestsArray.$loaded().then(function(members) {
        $scope.requests = [];

        members.forEach(function(member) {
            if (member.selection !== undefined && member.selection.includes(teamName)) {
                $scope.requests.push({uid: member.$id, name: member.name});
            }
        });
    });


    $scope.changeCurrentTeamSize = function(change) {
        if ($scope.size + change >= $scope.currentTeamSize && $scope.size + change >= $scope.minTeamSize && $scope.size + change <= $scope.maxTeamSize) {
            eventTeamRef.update({size: $scope.size + change});
            $scope.size += change;
        }
    };


    // add member function
    $scope.addMember = function(request) {
        if ($scope.currentTeamSize < $scope.size) {
            // add the member to the team
            var member = {};
            member[$scope.currentTeamSize] = {uid: request.uid, name: request.name};
            console.log(member);
            eventTeamMembersRef.update(member);

            // update the request for the user
            var eventTeamMemberRequestRef = eventTeamMemberRequestsRef.child(request.uid);
            eventTeamMemberRequestRef.update({selection: null});

            // update the team for the event in the user's profile
            var userEventRef = firebase.database().ref().child("users").child(request.uid).child("events").child(eventName);
            userEventRef.update({team: teamName, selection: null});

            // remove the request
            var requestIndex = $scope.requests.indexOf(request);
            $scope.requests.splice(requestIndex, 1);

            // increase the current team size by 1
            eventTeamRef.update({currentTeamSize: $scope.currentTeamSize + 1});
            $scope.currentTeamSize += 1;
        }
    };

    // remove member function
    $scope.removeMember = function(member) {
        // remove the member from the team
        $scope.members.$remove(member);

        // update the team for the event in the user's profile
        var userEventRef = firebase.database().ref().child("users").child(member.uid).child("events").child(eventName);
        userEventRef.update({team: ""});

        // decrease the current team size by 1
        eventTeamRef.update({currentTeamSize: $scope.currentTeamSize - 1});
        $scope.currentTeamSize -= 1;
    };


    // add skill function
    $scope.addSkill = function() {
        var skillsArray = $firebaseArray(skillsRef);

        skillsArray.$loaded().then(function(skills) {
            var skill = {};
            skill[skills.length.toString()] = $scope.skillInput;

            skillsRef.update(skill);

            $scope.skillInput = null;
        });
    };
})
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('orange')
    .accentPalette('indigo');
});
