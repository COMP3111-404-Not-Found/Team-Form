/**
 * parse the team firebaseObject to a JavaScript array
 *
 * @param teamObj team firebaseObject
 * @return team JavaScript array
 */
function parseTeams(teamObj, userObj) {
    var teams = [];

    angular.forEach(teamObj, function(value, key) {
        var c = key.charAt(0);
        if (c !== "_" && c !== "$" && c !== ".") {
            teams.push({
                name: key,
                size: value.size,
                currentTeamSize: value.currentTeamSize,
                skills: value.skills,
                teamMembers: value.teamMembers,
                teamSkills: value.teamSkills,
                skillsMatch: (userObj !== null) ? isMatched(value.skills, userObj.skills) : null,
                missingSkillsMatch: (userObj !== null) ? missingSkillsMatched(value.skills, value.teamSkills, userObj.skills) : null
            });
        }
    });

    console.log(teams);
    return teams;
}

$(document).ready(function() {
    // change the title in the navigation to the event name
    $(".mdl-layout>.mdl-layout__header>.mdl-layout__header-row>.mdl-layout__title").html(getURLParameter("event") + " Event Team");
});

angular.module("teamform-eventteam-app", ["firebase", "ngMaterial"])
.controller("EventTeamCtrl", function($scope, $firebaseObject, $firebaseArray, $mdDialog) {
    initializeFirebase();


    $scope.eventName = getURLParameter("event");


    /* teams */
    var teamRef = firebase.database().ref().child("events").child($scope.eventName).child("team");
    var teamObj = null;


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

                $scope.userObj.$loaded().then(function(user) {
                    teamObj = $firebaseObject(teamRef);
                    teamObj.$loaded().then(function(teams) {
                        $scope.teams = parseTeams(teams, $scope.userObj);
                        $scope.dbTeams = angular.copy($scope.teams);
                    });
                });
            });
        } else {
            // No user is signed in.
            console.log('no user is signed in');

            // refresh the scope
            $scope.$apply(function() {
                $scope.user = null;

                userRef = null;
                $scope.userObj = null;

                teamObj = $firebaseObject(teamRef);
                teamObj.$loaded().then(function(teams) {
                    $scope.teams = parseTeams(teams, $scope.userObj);
                    $scope.dbTeams = angular.copy($scope.teams);
                });
            });
        }
    });


    var eventAdminParamRef = firebase.database().ref().child("events").child($scope.eventName).child("admin").child("param");
    var eventAdminParamObj = $firebaseObject(eventAdminParamRef);
    eventAdminParamObj.$loaded().then(function(admin) {
        $scope.minTeamSize = admin.minTeamSize;
        $scope.maxTeamSize = admin.maxTeamSize;
        $scope.startDate = admin.startDate;
        $scope.endDate = admin.endDate;
        $scope.details = admin.details;
    });


    /* filter and sort switches */
    // bind variables
    $scope.filterPlacesSwitch = false;
    $scope.filterSkillsMatchSwitch = false;
    $scope.filterMissingSkillsMatchSwitch = false;
    $scope.sortPlacesSwitch = false;
    $scope.sortSkillsMatchSwitch = false;
    $scope.sortMissingSkillsMatchSwitch = false;

    // filter teams that still have places left
    $scope.filterPlaces = function(teams) {
        console.log("filterPlaces()");
        return getAvailableTeam(teams);
    };

    // filter teams that match the signed in user skills
    $scope.filterSkillsMatch = function(teams) {
        console.log("filterSkillsMatch()");
        return teams.filter(function(team) {return team.skillsMatch.number > 0;});
    };

    // filter teams that missing the signed in user skills
    $scope.filterMissingSkillsMatch = function(teams) {
        console.log("filterMissingSkillsMatch()");
        return teams.filter(function(team) {return team.missingSkillsMatch.number > 0;});
    };

    // filter the teams
    $scope.filterTeams = function(filterPlacesSwitch, filterSkillsMatchSwitch, filterMissingSkillsMatchSwitch) {
        var teams = angular.copy($scope.dbTeams);

        if (filterPlacesSwitch) {
            teams = $scope.filterPlaces(teams);
        }

        if (filterSkillsMatchSwitch) {
            teams = $scope.filterSkillsMatch(teams);
        }

        if (filterMissingSkillsMatchSwitch) {
            teams = $scope.filterMissingSkillsMatch(teams);
        }

        $scope.teams = angular.copy(teams);

        document.querySelector(".mdl-js-snackbar").MaterialSnackbar.showSnackbar({message: "Filtered events"});
    };

    // sort teams by the number of places left
    $scope.sortPlaces = function(teams) {
        console.log("sortPlaces()");
        return teams.sort(function(a, b) {
            var x = a["size"]-a["currentTeamSize"]; var y = b["size"]-b["currentTeamSize"];
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    };

    // sort teams by the number of skills matched
    $scope.sortSkillsMatch = function(teams) {
        console.log("sortSkillsMatch()");
        return teams.sort(function(a, b) {
            var x = a.skillsMatch.number; var y = b.skillsMatch.number;
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    };

    // sort teams by the number of missing skills matched
    $scope.sortMissingSkillsMatch = function(teams) {
        console.log("sortMissingSkillsMatch()");
        return teams.sort(function(a, b) {
            var x = a.missingSkillsMatch.number; var y = b.missingSkillsMatch.number;
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    };


    // sort the teams
    $scope.sortTeams = function(sortBy) {
        if (sortBy === "places") {
            $scope.sortSkillsMatchSwitch = false;
            $scope.sortMissingSkillsMatchSwitch = false;
        } else if (sortBy === "skillsMatch") {
            $scope.sortPlacesSwitch = false;
            $scope.sortMissingSkillsMatchSwitch = false;
        } else if (sortBy === "missingSkillsMatch") {
            $scope.sortSkillsMatchSwitch = false;
            $scope.sortPlacesSwitch = false;
        }

        var teams = angular.copy($scope.teams);

        if ($scope.sortPlacesSwitch) {
            teams = $scope.sortPlaces(teams);
        } else if ($scope.sortSkillsMatchSwitch) {
            teams = $scope.sortSkillsMatch(teams);
        } else if ($scope.sortMissingSkillsMatchSwitch) {
            teams = $scope.sortMissingSkillsMatch(teams);
        }

        $scope.teams = angular.copy(teams);

        if (sortBy === "places" && $scope.sortPlacesSwitch) {
            document.querySelector(".mdl-js-snackbar").MaterialSnackbar.showSnackbar({message: "Sorted teams by places left"});
        } else if (sortBy === "skillsMatch" && $scope.sortSkillsMatchSwitch) {
            document.querySelector(".mdl-js-snackbar").MaterialSnackbar.showSnackbar({message: "Sorted teams by skills match"});
        } else if (sortBy === "missingSkillsMatch" && $scope.sortMissingSkillsMatchSwitch) {
            document.querySelector(".mdl-js-snackbar").MaterialSnackbar.showSnackbar({message: "Sorted teams by missing skills match"});
        }
    };


    // create new team function
    $scope.createTeam = function() {
        var teamNameInput = $mdDialog.prompt()
            .title("Create a New Team")
            .ok("Create")
            .cancel("Cancel");

        $mdDialog.show(teamNameInput)
            .then(function(team) {
                var newTeamRef = teamRef.child(team);
                newTeamRef.set({size: parseInt(($scope.minTeamSize + $scope.maxTeamSize) / 2), currentTeamSize: 0});
            });
    };


    // request team function
    $scope.requestTeam = function(teamName) {
        var eventMemberTeamRef = firebase.database().ref().child("events").child($scope.eventName).child("member").child($scope.user.uid).child("selection");
        var userEventRef = firebase.database().ref().child("users").child($scope.user.uid).child("events").child($scope.eventName).child("selection");
        var eventMemberTeamArray = $firebaseArray(eventMemberTeamRef);

        eventMemberTeamArray.$loaded().then(function(selections) {
            var requests = [];

            // add the selections stored in the database
            selections.forEach(function(selection) {
                requests.push(selection.$value);
            });

            // add the request team if it was not in the database
            if (!requests.includes(teamName)) {
                requests.push(teamName);
            }

            // update the record in the event
            eventMemberTeamRef.set(requests);
            // update the record in the user's profile
            userEventRef.set(requests);

            document.querySelector(".mdl-js-snackbar").MaterialSnackbar.showSnackbar({message: "Requested team " + teamName});
        });
    };
})
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('orange')
    .accentPalette('indigo');
});
