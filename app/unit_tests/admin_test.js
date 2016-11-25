describe("Admin Controller", function() {
    beforeEach(module("teamform-admin-app"));

    var $controller, $firebaseObject, $firebaseArray, $window, $mdDialog;

    beforeEach(inject(function(_$controller_, _$firebaseObject_, _$firebaseArray_, _$window_, _$mdDialog_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $firebaseObject = _$firebaseObject_;
        $firebaseArray = _$firebaseArray_;
        $window = _$window_;
        $mdDialog = _$mdDialog_;
    }));

    beforeEach(function() {
        // mock firebase reference update
        spyOn(firebase.database.Reference.prototype, "update").and.callFake(function(obj) {
            console.log("update", obj);
        });

        // mock firebase reference set
        spyOn(firebase.database.Reference.prototype, "set").and.callFake(function(obj) {
            console.log("set", obj);
        });
    });

    afterEach(function() {
        firebase.app().delete();
    });

    describe("$scope.changeMinTeamSize", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            $scope.param = {
                $save: function() {
                    console.log("saved");
                }
            };
        });

        it("increase minimum team size", function() {
            $scope.param.minTeamSize = 1;
            $scope.param.maxTeamSize = 10;

            $scope.changeMinTeamSize(1);

            expect($scope.param.minTeamSize).toEqual(2);
        });

        it("decrease minimum team size", function() {
            $scope.param.minTeamSize = 2;
            $scope.param.maxTeamSize = 10;

            $scope.changeMinTeamSize(-1);

            expect($scope.param.minTeamSize).toEqual(1);
        });

        it("invalid minimum team size ($scope.minTeamSize < 1)", function() {
            $scope.param.minTeamSize = 1;
            $scope.param.maxTeamSize = 10;

            $scope.changeMinTeamSize(-1);

            expect($scope.param.minTeamSize).toEqual(1);
        });

        it("invalid minimum team size ($scope.minTeamSize + delta > $scope.maxTeamSize)", function() {
            $scope.param.minTeamSize = 1;
            $scope.param.maxTeamSize = 10;

            $scope.changeMinTeamSize(10);

            expect($scope.param.minTeamSize).toEqual(1);
        });
    });


    describe("$scope.changeMaxTeamSize", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            $scope.param = {
                $save: function() {
                    console.log("saved");
                }
            };
        });

        it("increase maximum team size", function() {
            $scope.param.minTeamSize = 1;
            $scope.param.maxTeamSize = 10;

            $scope.changeMaxTeamSize(1);

            expect($scope.param.maxTeamSize).toEqual(11);
        });

        it("decrease maximum team size", function() {
            $scope.param.minTeamSize = 1;
            $scope.param.maxTeamSize = 11;

            $scope.changeMaxTeamSize(-1);

            expect($scope.param.maxTeamSize).toEqual(10);
        });

        it("invalid maximum team size ($scope.maxTeamSize < 1)", function() {
            $scope.param.minTeamSize = 1;
            $scope.param.maxTeamSize = 10;

            $scope.changeMaxTeamSize(-11);

            expect($scope.param.maxTeamSize).toEqual(10);
        });

        it("invalid maximum team size ($scope.maxTeamSize + delta < $scope.minTeamSize)", function() {
            $scope.param.minTeamSize = 2;
            $scope.param.maxTeamSize = 10;

            $scope.changeMaxTeamSize(-9);

            expect($scope.param.maxTeamSize).toEqual(10);
        });
    });


    describe("$scope.saveFunc", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            $scope.param = {
                $save: function() {
                    console.log("save");
                }
            };

            // mock $window.open
            spyOn($window, "open").and.callFake(function(url, name) {
                console.log("open " + url + " in " + name);
            });
        });

        it("save", function() {
            $scope.saveFunc();

            expect($window.open).toHaveBeenCalledWith("index.html", "_self");
        });
    });


    describe("load data", function() {
        var $scope, controller;

        var adminObj = {
            admin: {
                param: {
                    minTeamSize: 1,
                    maxTeamSize: 10,
                    details: "details",
                    startDate: new Date().getTime(),
                    endDate: new Date().getTime()
                }
            }
        };

        beforeEach(function() {
            $scope = {};

            firebaseObjectMock = jasmine.createSpy("$firebaseObject mock");
            firebaseObjectMock.and.callFake(function(ref) {
                var refUrl = ref.toString();
                var refUrlSplit = refUrl.split("/");
                var refUrlSplitLength = refUrlSplit.length;

                // https://team-form-4ffd7.firebaseio.com/.../admin/param
                if (refUrlSplit[refUrlSplitLength-2] === "admin" && refUrlSplit[refUrlSplitLength-1] === "param") {
                    var obj = adminObj.admin.param;
                    obj.$loaded = function() {return {then: function(callback) {callback(adminObj.admin.param); return {catch: function(callback) {callback();}};}};};

                    return obj;
                }
            });

            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: firebaseObjectMock, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        it("load data", function() {
            expect($scope.param.minTeamSize).toEqual(adminObj.admin.param.minTeamSize);
            expect($scope.param.maxTeamSize).toEqual(adminObj.admin.param.maxTeamSize);
            expect($scope.details).toEqual(adminObj.admin.param.details);
            expect($scope.startDate).toEqual(new Date(adminObj.admin.param.startDate));
            expect($scope.endDate).toEqual(new Date(adminObj.admin.param.endDate));
        });
    });


    describe("$scope.startChange", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        it("set the minimum date when the start date changes", function() {
            $scope.startDate = new Date();
            $scope.minDate = null;

            $scope.startChange();

            expect($scope.minDate).toEqual($scope.startDate);
        });
    });


    describe("$scope.saveContent", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            $scope.details = "details";
            $scope.startDate = new Date();
            $scope.endDate = new Date();
        });

        it("invalid details ($scope.details === null)", function() {
            $scope.details = null;
            $scope.startDate = "";
            $scope.endDate = "";

            $scope.saveContent();
        });

        it("invalid start date ($scope.startDate === null)", function() {
            $scope.details = "";
            $scope.startDate = null;
            $scope.endDate = "";

            $scope.saveContent();
        });

        it("invalid start date ($scope.endDate === null)", function() {
            $scope.details = "";
            $scope.startDate = "";
            $scope.endDate = null;

            $scope.saveContent();
        });

        it("save the details of the event", function() {
            $scope.saveContent();

            expect(firebase.database.Reference.prototype.update).toHaveBeenCalledWith({details: "details", startDate: $scope.startDate.getTime(), endDate: $scope.endDate.getTime()});
        });
    });


    describe("$scope.zeroMember", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        it("the team does not have any members (teamMembers === undefined)", function() {
            teamMembers = undefined;

            var output = $scope.zeroMember(teamMembers);

            expect(output).toEqual(true);
        });

        it("the team does not have any members (teamMembers !== undefined)", function() {
            teamMembers = [
                {
                    uid: "uid",
                    displayName: "name"
                }
            ];

            var output = $scope.zeroMember(teamMembers);

            expect(output).toEqual(false);
        });
    });


    describe("$scope.confirmAutomaticTeamForm", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        it("confirm the automatic team form", function() {
            // mock $mdDialog.show
            spyOn($mdDialog, "show").and.callFake(function(options) {
                return {then: function(confirmCallback, cancelCallback) {confirmCallback(true);}};
            });

            $scope.confirmAutomaticTeamForm(function(confirm) {
                expect(confirm).toEqual(true);
            });
        });

        it("cancel the automatic team form", function() {
            // mock $mdDialog.show
            spyOn($mdDialog, "show").and.callFake(function(options) {
                return {then: function(confirmCallback, cancelCallback) {cancelCallback(false);}};
            });

            $scope.confirmAutomaticTeamForm(function(confirm) {
                expect(confirm).toEqual(false);
            });
        });
    });


    describe("$scope.getEventObj", function() {
        var $scope, controller;

        var eventObj = {
            admin: {},
            team: {},
            member: {}
        };

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            spyOn($firebaseObject.prototype, "$loaded").and.callFake(function(callback) {
                callback(eventObj);
            });
        });

        it("get the event object", function() {
            var expected = {
                admin: {},
                team: {},
                member: {}
            };

            $scope.getEventObj("event", function(event) {
                expect(event).toEqual(expected);
            });
        });
    });


    describe("$scope.getUserObj", function() {
        var $scope, controller;

        var userObj = {
            uid1: {
                displayName: "name1",
                events: {
                    event: {}
                }
            },
            uid2: {
                displayName: "name2"
            },
            uid3: {
                displayName: "name3",
                events: {
                    event2: {}
                }
            }
        };

        var usersFiltered = {
            uid1: {
                displayName: "name1",
                events: {
                    event: {}
                }
            }
        };

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            spyOn($firebaseObject.prototype, "$loaded").and.callFake(function(callback) {
                callback(userObj);
            });
        });

        it("get the user object", function() {
            $scope.getUserObj("event", function(users) {
                expect(users).toEqual(usersFiltered);
            });
        });
    });


    describe("$scope.sortRequests", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        it("sort the requests by missing skills match and skills match", function() {
            var requests = {};
            var skills = [];
            var teamSkills = [];

            var expected = {};

            $scope.sortRequests(requests, skills, teamSkills);

            expect(requests).toEqual(expected);
        });
    });


    describe("$scope.addRequests", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            // mock $scope sortRequests
            spyOn($scope, "sortRequests").and.callFake(function(requests, skills, teamSkills) {
                return;
            });
        });

        xit("add requests to fill all the places left for all teams", function() {
            var event = {
                team: {
                    team1: {
                        size: 5,
                        currentTeamSize: 4,
                        teamMembers: [],
                        skills: ["Programming"],
                        teamSkills: ["Programming"]
                    },
                    team2: {
                        size: 5,
                        currentTeamSize: 5,
                        teamMembers: [],
                        skills: ["Programming"],
                        teamSkills: ["Programming"]
                    },
                    team3: {
                        size: 5,
                        currentTeamSize: 4,
                        teamMembers: [],
                        skills: ["Programming"],
                        teamSkills: ["Programming"]
                    }
                },
                member: {
                    uid1: {name: "name1", skills: ["Programming"], selection: ["team1"]},
                    uid2: {name: "name2"},
                    uid3: {name: "name3", selection: ["team2"]}
                }
            };
            var users = {
                uid1: {name: "name1", skills: ["Programming"], events: {event: {team: "", selection: ["team1"]}}},
                uid2: {name: "name2"},
                uid3: {name: "name3", events: {event: {team: "", selection: ["team2"]}}}
            };
            var eventName = "event";

            var eventExpected = {
                team: {
                    team1: {
                        size: 5,
                        currentTeamSize: 5,
                        teamMembers: [
                            {uid: "uid1", name: "name1", skills: ["Programming"]}
                        ],
                        skills: ["Programming"],
                        teamSkills: ["Programming"]
                    },
                    team2: {
                        size: 5,
                        currentTeamSize: 5,
                        teamMembers: [],
                        skills: ["Programming"],
                        teamSkills: ["Programming"]
                    },
                    team3: {
                        size: 5,
                        currentTeamSize: 4,
                        teamMembers: [],
                        skills: ["Programming"],
                        teamSkills: ["Programming"]
                    }
                },
                member: {
                    uid1: {name: "name1", skills: ["Programming"], selection: ["team1"]},
                    uid2: {name: "name2"},
                    uid3: {name: "name3", selection: ["team2"]}
                }
            };
            var usersExpected = {
                uid1: {name: "name1", skills: ["Programming"], events: {event: {team: "team1"}}},
                uid2: {name: "name2"},
                uid3: {name: "name3", events: {event: {team: "", selection: ["team2"]}}}
            };

            $scope.addRequests(event, users, eventName);

            expect(event).toEqual(eventExpected);
            expect(users).toEqual(usersExpected);
        });
    });


    describe("$scope.remainingTeamSizes", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        it("even distribution", function() {
            var minTeamSize = 1;
            var maxTeamSize = 10;
            var remaining = 30;

            var expected = [];
            for (var i = 0; i < 6; i++) {
                expected.push(5);
            }

            expect($scope.remainingTeamSizes(minTeamSize, maxTeamSize, remaining)).toEqual(expected);
        });

        it("uneven distribution", function() {
            var minTeamSize = 1;
            var maxTeamSize = 10;
            var remaining = 34;

            var expected = [];
            for (var i = 0; i < 6; i++) {
                expected.push(5);
            }
            expected.push(4);

            expect($scope.remainingTeamSizes(minTeamSize, maxTeamSize, remaining)).toEqual(expected);
        });
    });


    describe("$scope.formRemaining", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        xit("form teams for the remaining members that do not have a team", function() {
            var event = {};
            var users = {};
            var eventName = "event";

            var eventExpected = {};
            var usersExpected = {};

            $scope.formRemaining(event, users, eventName);

            expect(event).toEqual(eventExpected);
            expect(users).toEqual(usersExpected);
        });
    });


    describe("$scope.automaticTeamForm", function() {
        var $scope, controller;

        var eventObj = {};

        var usersFiltered = {};

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            // mock $mdDialog.show
            spyOn($mdDialog, "show").and.callFake(function(options) {
                return {then: function(confirmCallback, cancelCallback) {confirmCallback(true);}};
            });
        });

        beforeEach(function() {
            // mock $scope getEventObj
            spyOn($scope, "getEventObj").and.callFake(function(eventName, callback) {
                callback(eventObj);
            });

            // mock $scope getUserObj
            spyOn($scope, "getUserObj").and.callFake(function(eventName, callback) {
                callback(usersFiltered);
            });
        });

        it("cancel the automatic team form", function() {
            // mock $mdDialog.show
            $mdDialog.show.and.callFake(function(options) {
                return {then: function(confirmCallback, cancelCallback) {cancelCallback(false);}};
            });

            $scope.automaticTeamForm();
        });

        xit("automatic team form", function() {
            $scope.automaticTeamForm();
        });
    });
});
