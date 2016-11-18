describe("Event Team Functions", function() {
    describe("parseTeams", function() {
        var teamObj = {
            team1: {
                size: 5,
                currentTeamSize: 1,
                skills: ["Programming"],
                teamMembers: [
                    {uid: "uid", name: "name", skills: ["Programming"]}
                ]
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
            $scope.filterPlacesSwitch = true;
            $scope.dbTeams = [
            {
                currentTeamSize: 1,
                size: 5,
                skills: ["C++"],
                teamMembers: [{name:"STO", uid:"qwertyqwerty"}]
            },
            {
                currentTeamSize: 4,
                size: 4,
                skills: ["C++"],
                teamMembers: [
                {name:"STO1", uid:"qwertyqwerty"},{name:"STO2", uid:"qwertyqwerty"},
                {name:"STO3", uid:"qwertyqwerty"},{name:"STO4", uid:"qwertyqwerty"}
                ]
            }];

            var expected = [{
                currentTeamSize: 1,
                size: 5,
                skills: ["C++"],
                teamMembers: [{name:"STO", uid:"qwertyqwerty"}]
            }];

            $scope.filterPlaces();
            expect($scope.teams).toEqual(expected);
            $scope.filterPlacesSwitch = false;
            $scope.filterPlaces();
            expect($scope.teams).toEqual($scope.dbTeams);
        });
    });


    describe("$scope.sortPlaces", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("EventTeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $mdDialog: $mdDialog});
        });

        it("sort the teams by the number of places left", function() {
            $scope.sortPlaces();
        });
    });


    describe("$scope.filterSkillsMatch", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("EventTeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $mdDialog: $mdDialog});
        });

        it("filter the teams that have skills that the user has", function() {
            $scope.filterSkillsMatch();
        });
    });


    describe("$scope.sortSkillsMatch", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("EventTeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $mdDialog: $mdDialog});
        });

        it("sort the teams by the number of skills matched", function() {
            $scope.sortSkillsMatch();
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
