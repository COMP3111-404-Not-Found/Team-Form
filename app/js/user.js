angular.module("teamform-user-app", ["firebase", "ngMaterial", "ngMessages"])
.controller("UserCtrl", function($scope, $firebaseObject, $firebaseArray) {
    initializeFirebase();

    $scope.user = null;

    var userRef = null;
    $scope.userObj = null;

    var skillsRef = null;
    $scope.skills = null;

    var eventTeamRef = null;
    $scope.eventTeamObj = null;

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

                skillsRef = userRef.child("skills");
                $scope.skills = $firebaseArray(skillsRef);

                $scope.userObj.$loaded().then(function() {
                    // get the events object from the database after the user object is loaded
                    eventTeamRef = firebase.database().ref().child("events");
                    $scope.eventTeamObj = $firebaseObject(eventTeamRef);
                    $scope.eventTeamObj.$loaded().then(function() {
                        console.log($scope.eventTeamObj);
                        $scope.recommend();
                    });
                });

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

                skillsRef = null;
                $scope.skills = null;

                eventTeamRef = null;
                $scope.eventTeamObj = null;

                // change the title in the navigation to "User"
                $(".mdl-layout>.mdl-layout__header>.mdl-layout__header-row>.mdl-layout__title").html("User");
            });
        }
    });


    $scope.skillInput = null;

    // add skill function
    $scope.addSkill = function() {
        // return if no user is signed in
        if (!$scope.user) {
            return;
        }

        // return if the skill input is invalid
        if (!$scope.skillInput) {
            return;
        }

        var skillsArray = $firebaseArray(skillsRef);
        skillsArray.$loaded().then(function(skills) {
            var skill = {};
            skill[skills.length.toString()] = $scope.skillInput;

            // add the skill to the user's profile
            skillsRef.update(skill);

            // add the skill to the member object of all the events that the user joined
            for (var i in $scope.userObj.events) {
                var eventRef = firebase.database().ref().child("events").child(i).child("member").child($scope.user.uid).child("skills");
                eventRef.update(skill);
            }

            $scope.skillInput = null;
            $("#skillInput").blur();
        });
    };


    /* recommendations */
    $scope.recommendations = [];

    // filter the events to events that the user joined
    $scope.filterEvents = function(eventTeamObj, userObj) {
        var eventTeam = {};

        angular.forEach(eventTeamObj, function(eventValue, eventKey) {
            var c = eventKey.charAt(0);
            if (c !== "_" && c !== "$" && c !== ".") {
                if (userObj.events[eventKey] !== undefined) {
                    eventTeam[eventKey] = eventValue;
                }
            }
        });

        return eventTeam;
    };

    // construct the recommendations array object
    $scope.constructRecommendations = function(eventTeamObj) {
        var recommendations = [];

        angular.forEach(eventTeamObj, function(eventValue, eventKey) {
            var recommendation = {
                eventName: eventKey,
                teams: []
            };

            angular.forEach(eventValue.team, function(teamValue, teamKey) {
                recommendation.teams.push({
                    teamName: teamKey,
                    placesLeft: teamValue.size - teamValue.currentTeamSize,
                    skillsMatch: {match: [], number: 0},
                    missingSkillsMatch: {match: [], number: 0},
                    skills: teamValue.skills,
                    teamSkills: teamValue.teamSkills
                });
            });

            recommendations.push(recommendation);
        });

        return recommendations;
    };

    // limit the number of recommendations for each event
    $scope.limitRecommendations = function(recommendations, limit) {
        var recommendationsLimited = [];

        angular.forEach(recommendations, function(recommendation) {
            recommendationsLimited.push(recommendation);

            if (recommendation.teams.length > limit) {
                recommendationsLimited[recommendationsLimited.length-1].teams = recommendation.teams.slice(0, limit);
            }
        });

        return recommendationsLimited;
    };

    $scope.recommend = function() {
        $scope.recommendations = [];

        var eventsFiltered = $scope.filterEvents($scope.eventTeamObj, $scope.userObj);

        $scope.recommendations = $scope.constructRecommendations(eventsFiltered);
        console.log($scope.recommendations);
    };
})
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('orange')
    .accentPalette('indigo');
});
