describe("Event Team Functions", function() {
    describe("parseTeams", function() {
        it("parse the team firebaseObject to a JavaScript array", function() {
            var userObj = {uid: "uid", name: "name", skills: ["Programming"]};
            var teamObj = {
                team1: {
                    size: 5,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    teamSkills: ["Programming"],
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
                    ],
                    teamSkills: ["Programming"],
                    skillsMatch: {match:["Programming"], number: 1 }
                }
            ];
            expect(parseTeams(teamObj, userObj)).toEqual(expected);

        });
        it("parse the team firebaseObject to a JavaScript array", function() {
            var userObj = null;
            var teamObj = {
                team1: {
                    size: 5,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    teamSkills: ["Programming"],
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
                    ],
                    teamSkills: ["Programming"],
                    skillsMatch: null
                }
            ];
            expect(parseTeams(teamObj, userObj)).toEqual(expected);

        });
    });
});


describe("Event Team Controller", function() {
    beforeEach(module("teamform-eventteam-app"));

    var $controller, $firebaseObject, $firebaseArray, $mdDialog;

    var adminObj = {
        admin: {
            param: {
                maxTeamSize: 10,
                minTeamSize: 1
            }
        }
    };

    var teamObj = {
        team: {
            team: {
                size: 5,
                currentTeamSize: 1,
                skills: ["Programming"],
                teamMembers: [
                    {uid: "uid", name: "member", skills: ["Programming"]}
                ],
                teamSkills: ["Programming"]
            }
        }
    };

    beforeEach(inject(function(_$controller_, _$firebaseObject_, _$firebaseArray_, _$mdDialog_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;

        // mock $firebaseObject
        $firebaseObject = jasmine.createSpy("$firebaseObject");
        $firebaseObject.and.callFake(function(ref) {
            var refUrl = ref.toString();
            var refUrlSplit = refUrl.split("/");
            var refUrlSplitLength = refUrlSplit.length;

            // https://team-form-4ffd7.firebaseio.com/.../admin/param
            if (refUrlSplit[refUrlSplitLength-2] === "admin" && refUrlSplit[refUrlSplitLength-1] === "param") {
                var obj = adminObj.admin.param;
                obj.$loaded = function() {return {then: function(callback) {callback(adminObj.admin.param);}};};

                return obj;
            }

            // https://team-form-4ffd7.firebaseio.com/.../team/
            if (refUrlSplit[refUrlSplitLength-1] === "team") {
                var obj = teamObj.team.team;
                obj.$loaded = function() {return {then: function(callback) {callback(teamObj.team);}};};

                return obj;
            }
        });

        $firebaseArray = _$firebaseArray_;

        $mdDialog = _$mdDialog_;
        // mock $mdDialog.show
        spyOn($mdDialog, "show").and.callFake(function(options) {
            return {then: function(callback) {console.log("$mdDialog show promise");}};
        });
    }));

    afterEach(function() {
        firebase.app().delete();
    });


    describe("load data", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("EventTeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            $scope.userObj = {uid: "uid", name: "name", skills: ["Programming"]};
        });

        it("load data", function() {
            expect($scope.minTeamSize).toEqual(adminObj.admin.param.minTeamSize);
            expect($scope.maxTeamSize).toEqual(adminObj.admin.param.maxTeamSize);
            expect($scope.startDate).toEqual(adminObj.admin.param.startDate);
            expect($scope.endDate).toEqual(adminObj.admin.param.endDate);
            expect($scope.details).toEqual(adminObj.admin.param.details);

            expect($scope.teams).toEqual([
                {name: "team", size: 5, currentTeamSize: 1, skills: ["Programming"], teamMembers: [{uid: "uid", name: "member", skills: ["Programming"]}], teamSkills: ["Programming"], skillsMatch: null}
            ]);
            expect($scope.dbTeams).toEqual($scope.teams);
        });
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
            var teams = [
                {
                    name: "team1",
                    size: 5,
                    currentTeamSize: 1,
                    skills: ["Programming", "Android", "C++"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    skillsMatch:{match:["Android","C++"], number: 2 }
                },
                {
                    name: "team2",
                    size: 2,
                    currentTeamSize: 1,
                    skills: ["Programming","Beta"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    skillsMatch:{match:[], number: 0 }
                },
                {
                    name: "team3",
                    size: 4,
                    currentTeamSize: 1,
                    skills: ["Programming", "Delta", "Python"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    skillsMatch:{match:["Delta"], number: 1 }
                },
                {
                    name: "team4",
                    size: 2,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    skillsMatch:{match:[""], number: 0 }
                }
            ];
            var expected = [
                {
                    name: "team1",
                    size: 5,
                    currentTeamSize: 1,
                    skills: ["Programming", "Android", "C++"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    skillsMatch:{match:["Android","C++"], number: 2 }
                },
                {
                    name: "team3",
                    size: 4,
                    currentTeamSize: 1,
                    skills: ["Programming", "Delta", "Python"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    skillsMatch:{match:["Delta"], number: 1 }
                }
            ];
            expect($scope.filterSkillsMatch(teams)).toEqual(expected);
        });
    });


    describe("$scope.sortSkillsMatch", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("EventTeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $mdDialog: $mdDialog});
        });

        it("sort the teams by the number of skills matched", function() {
            var teams = [
                {
                    name: "team1",
                    size: 5,
                    currentTeamSize: 1,
                    skills: ["Programming", "Android", "C++"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    skillsMatch:{match:["Android","C++"], number: 2 }
                },
                {
                    name: "team2",
                    size: 2,
                    currentTeamSize: 1,
                    skills: ["Programming","Beta"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    skillsMatch:{match:[], number: 0 }
                },
                {
                    name: "team3",
                    size: 4,
                    currentTeamSize: 1,
                    skills: ["Programming", "Delta", "Python"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    skillsMatch:{match:["Delta"], number: 1 }
                },
                {
                    name: "team4",
                    size: 2,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    skillsMatch:{match:[""], number: 0 }
                }
            ];

            var expected = [
                {
                    name: "team1",
                    size: 5,
                    currentTeamSize: 1,
                    skills: ["Programming", "Android", "C++"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    skillsMatch:{match:["Android","C++"], number: 2 }
                },
                
                {
                    name: "team3",
                    size: 4,
                    currentTeamSize: 1,
                    skills: ["Programming", "Delta", "Python"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    skillsMatch:{match:["Delta"], number: 1 }
                },
                {
                    name: "team2",
                    size: 2,
                    currentTeamSize: 1,
                    skills: ["Programming","Beta"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    skillsMatch:{match:[], number: 0 }
                },
                {
                    name: "team4",
                    size: 2,
                    currentTeamSize: 1,
                    skills: ["Programming"],
                    teamMembers: [
                        {uid: "uid", name: "name", skills: ["Programming"]}
                    ],
                    skillsMatch:{match:[""], number: 0 }
                }
            ];
            expect($scope.sortSkillsMatch(teams)).toEqual(expected);
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
            expect($mdDialog.show).toHaveBeenCalled();
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
