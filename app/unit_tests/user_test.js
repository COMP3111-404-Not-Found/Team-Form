describe("User Functions", function() {
    describe("recommendationSort", function() {
        it("team1 has places left, team2 does not have places left", function() {
            var team1 = {
                teamName: "team1",
                placesLeft: 1,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: [], number: 0}
            };

            var team2 = {
                teamName: "team2",
                placesLeft: 0,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: [], number: 0}
            };

            expect(recommendationSort(team1, team2)).toEqual(-1);
        });

        it("team1 does not have places left, team2 has places left", function() {
            var team1 = {
                teamName: "team1",
                placesLeft: 0,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: [], number: 0}
            };

            var team2 = {
                teamName: "team2",
                placesLeft: 1,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: [], number: 0}
            };

            expect(recommendationSort(team1, team2)).toEqual(1);
        });

        it("team1 has more missing skills match, both teams have places left", function() {
            var team1 = {
                teamName: "team1",
                placesLeft: 1,
                missingSkillsMatch: {match: ["Programming"], number: 1},
                skillsMatch: {match: [], number: 0}
            };

            var team2 = {
                teamName: "team2",
                placesLeft: 1,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: [], number: 0}
            };

            expect(recommendationSort(team1, team2)).toEqual(-1);
        });

        it("team1 has more missing skills match, both teams do not have places left", function() {
            var team1 = {
                teamName: "team1",
                placesLeft: 0,
                missingSkillsMatch: {match: ["Programming"], number: 1},
                skillsMatch: {match: [], number: 0}
            };

            var team2 = {
                teamName: "team2",
                placesLeft: 0,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: [], number: 0}
            };

            expect(recommendationSort(team1, team2)).toEqual(-1);
        });

        it("team2 has more missing skills match, both teams have places left", function() {
            var team1 = {
                teamName: "team1",
                placesLeft: 1,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: [], number: 0}
            };

            var team2 = {
                teamName: "team2",
                placesLeft: 1,
                missingSkillsMatch: {match: ["Programming"], number: 1},
                skillsMatch: {match: [], number: 0}
            };

            expect(recommendationSort(team1, team2)).toEqual(1);
        });

        it("team2 has more missing skills match, both teams do not have places left", function() {
            var team1 = {
                teamName: "team1",
                placesLeft: 0,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: [], number: 0}
            };

            var team2 = {
                teamName: "team2",
                placesLeft: 0,
                missingSkillsMatch: {match: ["Programming"], number: 1},
                skillsMatch: {match: [], number: 0}
            };

            expect(recommendationSort(team1, team2)).toEqual(1);
        });

        it("team1 has more skills match, both teams have places left and same missing skills match", function() {
            var team1 = {
                teamName: "team1",
                placesLeft: 1,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: ["Programming"], number: 1}
            };

            var team2 = {
                teamName: "team2",
                placesLeft: 1,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: [], number: 0}
            };

            expect(recommendationSort(team1, team2)).toEqual(-1);
        });

        it("team1 has more skills match, both teams do not have places left and same missing skills match", function() {
            var team1 = {
                teamName: "team1",
                placesLeft: 0,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: ["Programming"], number: 1}
            };

            var team2 = {
                teamName: "team2",
                placesLeft: 0,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: [], number: 0}
            };

            expect(recommendationSort(team1, team2)).toEqual(-1);
        });

        it("team2 has more skills match, both teams have places left and same missing skills match", function() {
            var team1 = {
                teamName: "team1",
                placesLeft: 1,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: [], number: 0}
            };

            var team2 = {
                teamName: "team2",
                placesLeft: 1,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: ["Programming"], number: 1}
            };

            expect(recommendationSort(team1, team2)).toEqual(1);
        });

        it("team2 has more skills match, both teams do not have places left and same missing skills match", function() {
            var team1 = {
                teamName: "team1",
                placesLeft: 0,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: [], number: 0}
            };

            var team2 = {
                teamName: "team2",
                placesLeft: 0,
                missingSkillsMatch: {match: [], number: 0},
                skillsMatch: {match: ["Programming"], number: 1}
            };

            expect(recommendationSort(team1, team2)).toEqual(1);
        });

        it("both teams have the same missing skills match and skills match, team1 has more places left", function() {
            var team1 = {
                teamName: "team1",
                placesLeft: 1,
                missingSkillsMatch: {match: ["Programming"], number: 1},
                skillsMatch: {match: ["Programming"], number: 1}
            };

            var team2 = {
                teamName: "team2",
                placesLeft: 0,
                missingSkillsMatch: {match: ["Programming"], number: 1},
                skillsMatch: {match: ["Programming"], number: 1}
            };

            expect(recommendationSort(team1, team2)).toEqual(-1);
        });

        it("both teams have the same missing skills match and skills match, team2 has more places left", function() {
            var team1 = {
                teamName: "team1",
                placesLeft: 0,
                missingSkillsMatch: {match: ["Programming"], number: 1},
                skillsMatch: {match: ["Programming"], number: 1}
            };

            var team2 = {
                teamName: "team2",
                placesLeft: 1,
                missingSkillsMatch: {match: ["Programming"], number: 1},
                skillsMatch: {match: ["Programming"], number: 1}
            };

            expect(recommendationSort(team1, team2)).toEqual(1);
        });

        it("both teams are the same for recommendation sorting", function() {
            var team1 = {
                teamName: "team1",
                placesLeft: 1,
                missingSkillsMatch: {match: ["Programming"], number: 1},
                skillsMatch: {match: ["Programming"], number: 1}
            };

            var team2 = {
                teamName: "team2",
                placesLeft: 1,
                missingSkillsMatch: {match: ["Programming"], number: 1},
                skillsMatch: {match: ["Programming"], number: 1}
            };

            expect(recommendationSort(team1, team2)).toEqual(0);
        });
    });
});


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

            /*// mock $firebaseArray
            $firebaseArray = jasmine.createSpy("$firebaseObject");
            $firebaseArray.and.callFake(function(ref) {
                return {
                    $loaded: function() {
                        return {then: function(callback) {callback([]);}};
                    }
                };
            });*/

            controller = $controller("UserCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        /*beforeEach(function() {
            // mock firebase reference update
            spyOn(firebase.database.Reference.prototype, "update").and.callFake(function(obj) {
                console.log("update", obj);
            });
        });*/

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

        /*it("add a skill to the user profile", function() {
            $scope.user = {
                uid: "uid",
                displayName: "name"
            };
            $scope.userObj = {
                events: {
                    event1: {}
                }
            };
            $scope.skillInput = "Programming";

            $scope.addSkill();

            expect(firebase.database.Reference.prototype.update).toHaveBeenCalledWith({0: "Programming"});
        });*/
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

            var expected = [
                {
                    eventName: "event1",
                    teams: [
                        {
                            teamName: "team1",
                            placesLeft: 4,
                            skillsMatch: {match: ["Programming"], number: 1},
                            missingSkillsMatch: {match: [], number: 0},
                            skills: ["Programming"],
                            teamSkills: ["Programming"]
                        }
                    ]
                }
            ];

            expect($scope.constructRecommendations(eventTeamObj, userObj)).toEqual(expected);
        });
    });


    describe("$scope.provideRecommendations", function() {
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
                        }
                    ]
                }
            ];

            $scope.provideRecommendations(recommendations);

            expect(recommendations[0].teams[0].teamName).toEqual("team2");
            expect(recommendations[0].teams[1].teamName).toEqual("team1");
            expect(recommendations[0].teams[2].teamName).toEqual("team3");
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


    describe("$scope.requestTeam", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("UserCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        beforeEach(function() {
            $scope.user = {
                uid: "uid",
                displayName: "name"
            };

            // mock $firebaseArray object $loaded
            spyOn($firebaseArray.prototype, "$loaded").and.callFake(function() {
                return {then: function(callback) {callback([{$value: "team1"}]);}};
            });

            // mock firebase reference set
            spyOn(firebase.database.Reference.prototype, "set").and.callFake(function(obj) {
                console.log("set", obj);
            });

            // mock $scope.recommend
            spyOn($scope, "recommend").and.callFake(function() {
                console.log("recommend");
            });
        });

        it("request joining a team", function() {
            $scope.requestTeam("event", "team2");

            expect($firebaseArray.prototype.$loaded).toHaveBeenCalled();
            expect(firebase.database.Reference.prototype.set).toHaveBeenCalledWith(["team1", "team2"]);
            expect($scope.recommend).toHaveBeenCalled();
        });
    });
});
