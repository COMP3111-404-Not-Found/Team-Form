describe("Event Team Functions", function() {
    describe("parseTeams", function() {
        it("parse the team firebaseObject to a JavaScript array", function() {
            var teamObj = {
                team1: {
                    size: 5,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    $loaded: function() {
                        console.log("$loaded()");
                    }
                }
            };

            var expected = [
                {
                    name: "team1",
                    size: 5,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ]
                }
            ];

            expect(parseTeams(teamObj)).toEqual(expected);
        });
    });
});


describe("Event Team Controller", function() {
    beforeEach(module("teamform-eventteam-app"));

    var $controller, $firebaseObject, $firebaseArray, $mdDialog;

    beforeEach(inject(function(_$controller_, _$firebaseObject_, _$firebaseArray_, _$mdDialog_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $firebaseObject = _$firebaseObject_;
        $firebaseArray = _$firebaseArray_;
        $mdDialog = _$mdDialog_;
    }));

    afterEach(function() {
        firebase.app().delete();
    });

    describe("$scope.filterPlaces", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("EventTeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $mdDialog: $mdDialog});
        });

        it("filter teams that still have places left", function() {
            var teams = [
                {
                    name: "team1",
                    size: 5,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ]
                },
                {
                    name: "team2",
                    size: 1,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ]
                }
            ];

            var expected = [
                {
                    name: "team1",
                    size: 5,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ]
                }
            ];

            expect($scope.filterPlaces(teams)).toEqual(expected);
        });
    });


    describe("$scope.sortPlaces", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("EventTeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $mdDialog: $mdDialog});
        });

        it("sort the teams by the number of places left", function() {
            var teams = [
                {
                    name: "team1",
                    size: 5,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ]
                },
                {
                    name: "team2",
                    size: 2,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ]
                },
                {
                    name: "team3",
                    size: 4,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ]
                },
                {
                    name: "team4",
                    size: 2,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ]
                }
            ];

            var expected = [
                {
                    name: "team1",
                    size: 5,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ]
                },
                {
                    name: "team3",
                    size: 4,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ]
                },
                {
                    name: "team2",
                    size: 2,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ]
                },
                {
                    name: "team4",
                    size: 2,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ]
                }
            ];

            expect($scope.sortPlaces(teams)).toEqual(expected);
        });
    });


    describe("$scope.filterSkillsMatch", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("EventTeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $mdDialog: $mdDialog});
        });

        it("filter the teams that have skills that the user has", function() {
            // $scope.filterSkillsMatch(teams);
        });
    });


    describe("$scope.sortSkillsMatch", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("EventTeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $mdDialog: $mdDialog});
        });

        it("sort the teams by the number of skills matched", function() {
            // $scope.sortSkillsMatch(teams);
        });
    });


    describe("$scope.filterSort", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("EventTeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            $scope.filterPlacesSwitch = false;
            $scope.filterSkillsMatchSwitch = false;
        });

        it("filter and sort the teams", function() {
            // $scope.filterSort();
        });
    });


    describe("$scope.createTeam", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("EventTeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $mdDialog: $mdDialog});
        });

        it("create a team", function() {
            $scope.createTeam();
        });
    });


    /*describe("$scope.requestTeam", function() {
        var $scope, controller;

        var teamName = "";

        beforeEach(function() {
            $scope = {};
            controller = $controller("EventTeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            $scope.user = {
                uid: "uid",
                displayName: "name"
            };
            teamName = "team";
        });

        it("request joining a team", function() {
            $scope.requestTeam(teamName);
        });
    });*/
});
