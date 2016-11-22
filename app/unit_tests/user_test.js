describe("User Controller", function() {
    beforeEach(module("teamform-user-app"));

    var $controller, $firebaseObject, $firebaseArray;

    beforeEach(inject(function(_$controller_, _$firebaseObject_, _$firebaseArray_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $firebaseObject = _$firebaseObject_;
        $firebaseArray = _$firebaseArray_;
    }));

    afterEach(function() {
        firebase.app().delete();
    });

    describe("$scope.addSkill", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("UserCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        it("no user is signed in ($scope.user === null)", function() {
            $scope.user = null;
            $scope.skillInput = "Programming";

            $scope.addSkill();
        });

        it("invalid skill input ($scope.skillInput === null)", function() {
            $scope.user = {
                uid: "uid",
                displayName: "name"
            };
            $scope.skillInput = null;

            $scope.addSkill();
        });
    });


    describe("$scope.filterEvents", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("UserCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        it("filter the events to events that the user joined", function() {
            var eventTeamObj = {
                event1: {
                    team: {
                        team1: {
                            size: 5,
                            currentTeamSize: 0
                        },
                        team2: {
                            size: 5,
                            currentTeamSize: 0
                        }
                    }
                },
                event2: {
                    team: {
                        team1: {
                            size: 5,
                            currentTeamSize: 0
                        }
                    }
                },
                $id: "events"
            };

            var userObj = {
                name: "user",
                skills: ["Programming"],
                events: {
                    event1: {
                        team: "",
                        selection: ["team1"]
                    }
                }
            };

            var expected = {
                event1: {
                    team: {
                        team1: {
                            size: 5,
                            currentTeamSize: 0
                        },
                        team2: {
                            size: 5,
                            currentTeamSize: 0
                        }
                    }
                }
            };

            expect($scope.filterEvents(eventTeamObj, userObj)).toEqual(expected);
        });
    });


    describe("$scope.constructRecommendations", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("UserCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        it("construct the recommendations array object", function() {
            var eventTeamObj = {
                event1: {
                    team: {
                        team1: {
                            size: 5,
                            currentTeamSize: 1,
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        }
                    }
                }
            };

            var expected = [
                {
                    eventName: "event1",
                    teams: [
                        {
                            teamName: "team1",
                            placesLeft: 4,
                            skillsMatch: {match: [], number: 0},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        }
                    ]
                }
            ];

            expect($scope.constructRecommendations(eventTeamObj)).toEqual(expected);
        });
    });


    describe("$scope.sortRecommendationsPlacesLeft", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("UserCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        it("sort the recommendations by the number of places left descendingly", function() {
            var recommendations = [
                {
                    eventName: "event1",
                    teams: [
                        {
                            teamName: "team1",
                            placesLeft: 5,
                            skillsMatch: {match: [], number: 0},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        },
                        {
                            teamName: "team2",
                            placesLeft: 6,
                            skillsMatch: {match: [], number: 0},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        },
                        {
                            teamName: "team3",
                            placesLeft: 4,
                            skillsMatch: {match: [], number: 0},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        },
                        {
                            teamName: "team4",
                            placesLeft: 5,
                            skillsMatch: {match: [], number: 0},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        }
                    ]
                },
                {
                    eventName: "event2",
                    teams: [
                        {
                            teamName: "team1",
                            placesLeft: 5,
                            skillsMatch: {match: [], number: 0},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        },
                        {
                            teamName: "team2",
                            placesLeft: 4,
                            skillsMatch: {match: [], number: 0},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        },
                        {
                            teamName: "team3",
                            placesLeft: 6,
                            skillsMatch: {match: [], number: 0},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        }
                    ]
                }
            ];

            var expected = [
                {
                    eventName: "event1",
                    teams: [
                        {
                            teamName: "team2",
                            placesLeft: 6,
                            skillsMatch: {match: [], number: 0},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        },
                        {
                            teamName: "team1",
                            placesLeft: 5,
                            skillsMatch: {match: [], number: 0},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        },
                        {
                            teamName: "team4",
                            placesLeft: 5,
                            skillsMatch: {match: [], number: 0},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        },
                        {
                            teamName: "team3",
                            placesLeft: 4,
                            skillsMatch: {match: [], number: 0},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        }
                    ]
                },
                {
                    eventName: "event2",
                    teams: [
                        {
                            teamName: "team3",
                            placesLeft: 6,
                            skillsMatch: {match: [], number: 0},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        },
                        {
                            teamName: "team1",
                            placesLeft: 5,
                            skillsMatch: {match: [], number: 0},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        },
                        {
                            teamName: "team2",
                            placesLeft: 4,
                            skillsMatch: {match: [], number: 0},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        }
                    ]
                }
            ];

            $scope.sortRecommendationsPlacesLeft(recommendations);

            expect(recommendations).toEqual(expected);
        });
    });


    describe("$scope.limitRecommendations", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("UserCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        it("limit the number of recommendations for each event", function() {
            var recommendations = [
                {
                    eventName: "event1",
                    teams: [
                        {
                            teamName: "team1",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team2",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team3",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team4",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team5",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team6",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        }
                    ]
                },
                {
                    eventName: "event2",
                    teams: [
                        {
                            teamName: "team1",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team2",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team3",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team4",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team5",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        }
                    ]
                },
                {
                    eventName: "event3",
                    teams: [
                        {
                            teamName: "team1",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team2",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team3",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team4",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        }
                    ]
                }
            ];

            var expected = [
                {
                    eventName: "event1",
                    teams: [
                        {
                            teamName: "team1",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team2",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team3",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team4",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team5",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        }
                    ]
                },
                {
                    eventName: "event2",
                    teams: [
                        {
                            teamName: "team1",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team2",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team3",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team4",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team5",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        }
                    ]
                },
                {
                    eventName: "event3",
                    teams: [
                        {
                            teamName: "team1",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team2",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team3",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        },
                        {
                            teamName: "team4",
                            placesLeft: 1,
                            skillsMatch: {match: "Programming", number: 1}
                        }
                    ]
                }
            ];

            $scope.limitRecommendations(recommendations, 5);

            expect(recommendations).toEqual(expected);
        });
    });


    describe("$scope.recommend", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("UserCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        it("recommend", function() {
            $scope.eventTeamObj = {
                event1: {
                    team: {
                        team1: {
                            size: 5,
                            currentTeamSize: 1,
                            skills: ["Prgramming"],
                            teamSkills: ["Programming"]
                        },
                        team2: {
                            size: 6,
                            currentTeamSize: 1,
                            skills: ["Prgramming"],
                            teamSkills: ["Programming"]
                        },
                        team3: {
                            size: 4,
                            currentTeamSize: 1,
                            skills: ["Prgramming"],
                            teamSkills: ["Programming"]
                        },
                        team4: {
                            size: 5,
                            currentTeamSize: 0,
                            skills: ["Prgramming"],
                            teamSkills: ["Programming"]
                        },
                        team5: {
                            size: 5,
                            currentTeamSize: 0,
                            skills: ["Prgramming"],
                            teamSkills: ["Programming"]
                        },
                        team6: {
                            size: 5,
                            currentTeamSize: 0,
                            skills: ["Prgramming"],
                            teamSkills: ["Programming"]
                        }
                    }
                },
                event2: {
                    team: {
                        team1: {
                            size: 5,
                            currentTeamSize: 0
                        }
                    }
                },
                $id: "events"
            };

            $scope.userObj = {
                name: "user",
                skills: ["Programming"],
                events: {
                    event1: {
                        team: "",
                        selection: ["team1"]
                    }
                }
            };

            $scope.recommend();

            expect($scope.recommendations.length).toEqual(1);
            expect($scope.recommendations[0].eventName).toEqual("event1");
            expect($scope.recommendations[0].teams.length).toEqual(5);
            expect($scope.recommendations[0].teams[0].teamName).toEqual("team2");
            expect($scope.recommendations[0].teams[1].teamName).toEqual("team4");
            expect($scope.recommendations[0].teams[2].teamName).toEqual("team5");
            expect($scope.recommendations[0].teams[3].teamName).toEqual("team6");
            expect($scope.recommendations[0].teams[4].teamName).toEqual("team1");
        });
    });
});
