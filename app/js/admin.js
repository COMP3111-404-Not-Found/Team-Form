$(document).ready(function() {
    // change the title in the navigation to the event name
    $(".mdl-layout>.mdl-layout__header>.mdl-layout__header-row>.mdl-layout__title").html(getURLParameter("event") + " Event Admin");
});

angular.module("teamform-admin-app", ["firebase", "ngMaterial", "ngMessages"])
.controller("AdminCtrl", function($scope, $firebaseObject, $firebaseArray, $window, $mdDialog) {

    // TODO: implementation of AdminCtrl
    // Initialize $scope.param as an empty JSON object
    $scope.param = {};
    // Call Firebase initialization code defined in site.js
    initializeFirebase();
    var refPath, ref, eventName;
    eventName = getURLParameter("event");
    refPath = eventName + "/admin/param";
    ref = firebase.database().ref("events/" + refPath);
    // Link and sync a firebase object
    $scope.param = $firebaseObject(ref);
    $scope.param.$loaded()
        .then(function(data) {
            // Fill in some initial values when the DB entry doesn't exist
            if (typeof $scope.param.maxTeamSize == "undefined") {
                $scope.param.maxTeamSize = 10;
            }
            if (typeof $scope.param.minTeamSize == "undefined") {
                $scope.param.minTeamSize = 1;
            }
            // Enable the UI when the data is successfully loaded and synchornized
            $('#admin_page_controller').show();
        })
        .catch(function(error) {
            // Database connection error handling...
            //console.error("Error:", error);
        });
    refPath = eventName + "/team";
    $scope.team = [];
    $scope.team = $firebaseArray(firebase.database().ref("events/" + refPath));
    refPath = eventName + "/member";
    $scope.member = [];
    $scope.member = $firebaseArray(firebase.database().ref("events/" + refPath));
    $scope.changeMinTeamSize = function(delta) {
        var newVal = $scope.param.minTeamSize + delta;
        if (newVal >= 1 && newVal <= $scope.param.maxTeamSize) {
            $scope.param.minTeamSize = newVal;
        }
        $scope.param.$save();
    };
    $scope.changeMaxTeamSize = function(delta) {
        var newVal = $scope.param.maxTeamSize + delta;
        if (newVal >= 1 && newVal >= $scope.param.minTeamSize) {
            $scope.param.maxTeamSize = newVal;
        }
        $scope.param.$save();
    };
    $scope.saveFunc = function() {
        $scope.param.$save();
        // Finally, go back to the front-end
        $window.open("index.html", "_self");
    };

    // Date
    $scope.startDate = new Date();
    $scope.endDate = new Date();

    var eventAdminParamRef = firebase.database().ref().child("events").child(eventName).child("admin").child("param");
    var eventAdminParamObj = $firebaseObject(eventAdminParamRef);
    eventAdminParamObj.$loaded().then(function(admin) {
        $scope.startDate = new Date(admin.startDate);
        $scope.endDate = new Date(admin.endDate);
        $scope.details = admin.details;
        console.log($scope.startDate);
        console.log($scope.endDate);
        console.log($scope.details);

        if (admin.startDate == null && admin.endDate == null) {
            $scope.startDate = new Date();
            $scope.endDate = new Date();
        }
        if (admin.details == null) {
            $scope.details = null;
        }
    });

    $scope.minDate = new Date();
    $scope.startChange = function() {
        $scope.minDate = $scope.startDate;
    };

    $scope.saveContent = function() {
        if ($scope.details == null || $scope.startDate == null || $scope.endDate == null) {
            return;
        }

        //console.log($scope.startDate);
        //console.log($scope.details);
        ref.update({'startDate': $scope.startDate.getTime(), 'endDate': $scope.endDate.getTime(),
            'details': $scope.details});
    };

    $scope.zeroMember = function(teamMembers) {
        if (teamMembers === undefined) {
            return true;
        } else {
            return false;
        }
    };


    // confirm automatic team form
    $scope.confirmAutomaticTeamForm = function(callback) {
        $mdDialog.show({
            contentElement: "#automaticTeamFormDialog",
        }).then(function() {
            callback(true);
        }, function() {
            callback(false);
        });
    };

    $scope.dialogConfirm = function() {
        $mdDialog.hide();
    };

    $scope.dialogCancel = function() {
        $mdDialog.cancel();
    };

    // get the event object
    $scope.getEventObj = function(eventName, callback) {
        var eventRef = firebase.database().ref().child("events").child(eventName);
        var eventObj = $firebaseObject(eventRef);

        eventObj.$loaded(function(event) {
            var eventParsed = {};
            eventParsed.admin = event.admin;
            eventParsed.team = event.team;
            eventParsed.member = event.member;

            callback(eventParsed);
        });
    };

    // get the user object
    $scope.getUserObj = function(eventName, callback) {
        var userRef = firebase.database().ref().child("users");
        var userObj = $firebaseObject(userRef);

        userObj.$loaded(function(users) {
            var usersFiltered = {};

            angular.forEach(users, function(userValue, userKey) {
                if (userValue.events !== undefined && userValue.events[eventName] !== undefined) {
                    usersFiltered[userKey] = userValue;
                }
            });

            callback(usersFiltered);
        });
    };

    // sort the requests by missing skills match and skills match
    $scope.sortRequests = function(requests, skills, teamSkills) {
        requests.sort(function(request1, request2) {
            var missingSkillsMatch1 = missingSkillsMatched(skills, teamSkills, request1.skills);
            var missingSkillsMatch2 = missingSkillsMatched(skills, teamSkills, request2.skills);

            if (missingSkillsMatch1.number > missingSkillsMatch2.number) {
                return -1;
            } else if (missingSkillsMatch1.number < missingSkillsMatch2.number) {
                return 1;
            }

            var skillsMatch1 = isMatched(skills, request1.skills);
            var skillsMatch2 = isMatched(skills, request2.skills);

            if (skillsMatch1.number > skillsMatch2.number) {
                return -1;
            } else if (skillsMatch1.number < skillsMatch2.number) {
                return 1;
            }

            return 0;
        });
    };

    // add requests to fill all the places left for all teams
    $scope.addRequests = function(event, users, eventName) {
        angular.forEach(event.team, function(teamValue, teamKey, teams) {
            var placesLeft = teamValue.size - teamValue.currentTeamSize;

            if (placesLeft > 0) {
                var requests = [];

                angular.forEach(event.member, function(memberValue, memberKey) {
                    if (memberValue.selection !== undefined && memberValue.selection !== null && memberValue.selection.includes(teamKey)) {
                        requests.push({uid: memberKey, name: memberValue.name, skills: memberValue.skills});
                    }
                });

                $scope.sortRequests(requests, teamValue.skills, teamValue.teamSkills);

                var addRequestsNumber = (requests.length < placesLeft) ? requests.length : placesLeft;
                for (var i = 0; i < addRequestsNumber; i++) {
                    // add the request
                    if (teamValue.teamMembers === undefined) {
                        teams[teamKey].teamMembers = [];
                    }
                    teams[teamKey].teamMembers.push(requests[i]);

                    // update the skills that the team have
                    if (teamValue.teamSkills === undefined) {
                        teams[teamKey].teamSkills = [];
                    }
                    teams[teamKey].teamSkills = addTeamSkills(teamValue.teamSkills, requests[i].skills);

                    // update the request for the user
                    event.member[requests[i].uid].selection = null;

                    // update the team for the event in the user's profile
                    users[requests[i].uid].events[eventName] = {team: teamKey, selection: null};

                    // increase the current team size by 1
                    teams[teamKey].currentTeamSize += 1
                }
            }
        });
    };

    // calculate the team sizes for the remaining members
    $scope.remainingTeamSizes = function(minTeamSize, maxTeamSize, remaining) {
        var sizeAverage = Math.floor((minTeamSize + maxTeamSize) / 2);
        var teams = Math.floor(remaining / sizeAverage);

        var sizes = [];
        for (var i = 0; i < teams; i++) {
            sizes.push(sizeAverage);
        }
        if (remaining % sizeAverage !== 0) {
            sizes.push(remaining % sizeAverage);
        }

        return sizes;
    };

    // form teams for the remaining members that do not have a team
    $scope.formRemaining = function(event, users, eventName) {
        var remainingMembers = [];

        angular.forEach(event.member, function(memberValue, memberKey, members) {
            if (users[memberKey].events[eventName].team === "") {
                remainingMembers.push({uid: memberKey, name: memberValue.name, skills: memberValue.skills});
            }

            // update the request for the user
            members[memberKey].selection = null;

            // update the team for the event in the user's profile
            users[memberKey].events[eventName].selection = null;
        });

        var teamSizes = $scope.remainingTeamSizes(event.admin.param.minTeamSize, event.admin.param.maxTeamSize, remainingMembers.length);

        var teams = event.team;
        var memberIndex = 0;
        for (var i = 0; i < teamSizes.length; i++) {
            var team = {
                size: teamSizes[i],
                currentTeamSize: teamSizes[i],
                teamMembers: [],
                skills: [],
                teamSkills: []
            };
            var teamName = "atf_team" + (i+1).toString();

            // add the members
            team.teamMembers = remainingMembers.slice(memberIndex, memberIndex + teamSizes[i]);
            memberIndex += teamSizes[i];

            // add the team skills
            angular.forEach(team.teamMembers, function(member, index) {
                team.teamSkills = addTeamSkills(team.teamSkills, member.skills);
            });
            team.skills = team.teamSkills;

            // form the team
            teams[teamName] = team;

            // update the team for the event in the users' profile
            angular.forEach(team.teamMembers, function(member, index) {
                users[member.uid].events[eventName].team = teamName;
            });
        }
    };

    // automatic team form
    $scope.automaticTeamForm = function() {
        console.log("automatic team forming");

        $scope.getEventObj(eventName, function(event) {
            console.log("$scope.getEventObj", event);

            $scope.getUserObj(eventName, function(users) {
                console.log("$scope.getUserObj", users);

                $scope.addRequests(event, users, eventName);
                console.log("$scope.addRequests", event);
                console.log("$scope.addRequests", users);

                $scope.formRemaining(event, users, eventName);
                console.log("$scope.formRemaining", event);
                console.log("$scope.formRemaining", users);

                $scope.automaticTeamFormEvent = angular.copy(event);
                $scope.automaticTeamFormUsers = angular.copy(users);

                $scope.confirmAutomaticTeamForm(function(confirm) {
                    if (!confirm) {
                        console.log("cancel automatic team forming");
                        document.querySelector(".mdl-js-snackbar").MaterialSnackbar.showSnackbar({message: "Cancel automatic team form"});
                        return;
                    }

                    console.log("confirm automatic team forming");
                    document.querySelector(".mdl-js-snackbar").MaterialSnackbar.showSnackbar({message: "Team formed"});

                    var eventRef = firebase.database().ref().child("events").child(eventName);
                    eventRef.update(event);

                    var usersRef = firebase.database().ref().child("users");
                    usersRef.update(users);
                });
            });
        });
    };
})
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('orange')
    .accentPalette('indigo');
});
