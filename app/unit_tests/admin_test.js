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
        // spyOn getURLParameter
        getURLParameter = jasmine.createSpy("getURLParameter").and.callFake(function() {
            return "test";
        });
    });

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

        it("load data", function() {
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

            expect($scope.param.minTeamSize).toEqual(adminObj.admin.param.minTeamSize);
            expect($scope.param.maxTeamSize).toEqual(adminObj.admin.param.maxTeamSize);
            expect($scope.details).toEqual(adminObj.admin.param.details);
            expect($scope.startDate).toEqual(new Date(adminObj.admin.param.startDate));
            expect($scope.endDate).toEqual(new Date(adminObj.admin.param.endDate));
        });

        it("load data, $scope.param.minTeamSize = undefined, $scope.param.maxTeamSize = undefined", function() {
            $scope = {};

            firebaseObjectMock = jasmine.createSpy("$firebaseObject mock");
            firebaseObjectMock.and.callFake(function(ref) {
                var refUrl = ref.toString();
                var refUrlSplit = refUrl.split("/");
                var refUrlSplitLength = refUrlSplit.length;

                // https://team-form-4ffd7.firebaseio.com/.../admin/param
                if (refUrlSplit[refUrlSplitLength-2] === "admin" && refUrlSplit[refUrlSplitLength-1] === "param") {
                    var obj = {minTeamSize: undefined, maxTeamSize: undefined};
                    obj.$loaded = function() {return {then: function(callback) {callback({minTeamSize: undefined, maxTeamSize: undefined}); return {catch: function(callback) {callback();}};}};};

                    return obj;
                }
            });

            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: firebaseObjectMock, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});

            expect($scope.param.minTeamSize).toEqual(1);
            expect($scope.param.maxTeamSize).toEqual(10);
        });

        it("load data, $scope.param.minTeamSize = undefined, $scope.param.maxTeamSize = undefined", function() {
            $scope = {};

            firebaseObjectMock = jasmine.createSpy("$firebaseObject mock");
            firebaseObjectMock.and.callFake(function(ref) {
                var refUrl = ref.toString();
                var refUrlSplit = refUrl.split("/");
                var refUrlSplitLength = refUrlSplit.length;

                // https://team-form-4ffd7.firebaseio.com/.../admin/param
                if (refUrlSplit[refUrlSplitLength-2] === "admin" && refUrlSplit[refUrlSplitLength-1] === "param") {
                    var obj = {details: null, startDate: null, endDate: null};
                    obj.$loaded = function() {return {then: function(callback) {callback({details: null, startDate: null, endDate: null}); return {catch: function(callback) {callback();}};}};};

                    return obj;
                }
            });

            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: firebaseObjectMock, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});

            expect($scope.details).toBeNull;
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
                return {then: function(confirmCallback, cancelCallback) {confirmCallback();}};
            });

            $scope.confirmAutomaticTeamForm(function(confirm) {
                expect(confirm).toEqual(true);
            });
        });

        it("cancel the automatic team form", function() {
            // mock $mdDialog.show
            spyOn($mdDialog, "show").and.callFake(function(options) {
                return {then: function(confirmCallback, cancelCallback) {cancelCallback();}};
            });

            $scope.confirmAutomaticTeamForm(function(confirm) {
                expect(confirm).toEqual(false);
            });
        });
    });


    describe("$scope.dialogConfirm", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            // mock $mdDialog.hide
            spyOn($mdDialog, "hide").and.callFake(function() {
                console.log("confirm automatic team forming");
            });
        });

        it("confirm automatic team forming", function() {
            $scope.dialogConfirm();
        });
    });


    describe("$scope.dialogCancel", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            // mock $mdDialog.cancel
            spyOn($mdDialog, "cancel").and.callFake(function() {
                console.log("cancel automatic team forming");
            });
        });

        it("cancel automatic team forming", function() {
            $scope.dialogCancel();
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
            var requests = [
                {uid: "uid1", name: "name1", skills: ["Firebase"]},
                {uid: "uid2", name: "name2", skills: ["AngularJS"]},
                {uid: "uid3", name: "name3", skills: ["Python"]},
                {uid: "uid3", name: "name3", skills: ["C++"]}
            ];
            var skills = ["AngularJS", "Firebase"];
            var teamSkills = ["AngularJS"];

            var expected = [
                {uid: "uid1", name: "name1", skills: ["Firebase"]},
                {uid: "uid2", name: "name2", skills: ["AngularJS"]},
                {uid: "uid3", name: "name3", skills: ["Python"]},
                {uid: "uid3", name: "name3", skills: ["C++"]}
            ];

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

        it("add requests to fill all the places left for all teams", function() {
            var event = {
                team: {
                    team1: {
                        size: 5,
                        currentTeamSize: 4,
                        teamMembers: [
                            {uid: "uid1", name: "name1", skills: ["Programming"]},
                            {uid: "uid2", name: "name2", skills: ["Programming"]},
                            {uid: "uid3", name: "name3", skills: ["Programming"]},
                            {uid: "uid4", name: "name4", skills: ["Programming"]}
                        ],
                        skills: ["Programming"],
                        teamSkills: ["Programming"]
                    },
                    team2: {
                        size: 1,
                        currentTeamSize: 1,
                        teamMembers: [
                            {uid: "uid5", name: "name5", skills: ["Programming"]}
                        ],
                        skills: ["Programming"],
                        teamSkills: ["Programming"]
                    }
                },
                member: {
                    uid1: {name: "name1", skills: ["Programming"], selection: null},
                    uid2: {name: "name2", skills: ["Programming"], selection: null},
                    uid3: {name: "name3", skills: ["Programming"], selection: null},
                    uid4: {name: "name4", skills: ["Programming"], selection: null},
                    uid5: {name: "name5", skills: ["Programming"], selection: null},
                    uid6: {name: "name6", skills: ["Programming", "AI"], selection: ["team1"]}
                }
            };
            var users = {
                uid1: {name: "name1", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid2: {name: "name2", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid3: {name: "name3", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid4: {name: "name4", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid5: {name: "name5", skills: ["Programming"], events: {event: {team: "team2", selection: null}}},
                uid6: {name: "name6", skills: ["Programming", "AI"], events: {event: {team: "", selection: ["team1"]}}}
            };
            var eventName = "event";

            var eventExpected = {
                team: {
                    team1: {
                        size: 5,
                        currentTeamSize: 5,
                        teamMembers: [
                            {uid: "uid1", name: "name1", skills: ["Programming"]},
                            {uid: "uid2", name: "name2", skills: ["Programming"]},
                            {uid: "uid3", name: "name3", skills: ["Programming"]},
                            {uid: "uid4", name: "name4", skills: ["Programming"]},
                            {uid: "uid6", name: "name6", skills: ["Programming", "AI"]}
                        ],
                        skills: ["Programming"],
                        teamSkills: ["Programming", "AI"]
                    },
                    team2: {
                        size: 1,
                        currentTeamSize: 1,
                        teamMembers: [
                            {uid: "uid5", name: "name5", skills: ["Programming"]}
                        ],
                        skills: ["Programming"],
                        teamSkills: ["Programming"]
                    }
                },
                member: {
                    uid1: {name: "name1", skills: ["Programming"], selection: null},
                    uid2: {name: "name2", skills: ["Programming"], selection: null},
                    uid3: {name: "name3", skills: ["Programming"], selection: null},
                    uid4: {name: "name4", skills: ["Programming"], selection: null},
                    uid5: {name: "name5", skills: ["Programming"], selection: null},
                    uid6: {name: "name6", skills: ["Programming", "AI"], selection: null}
                }
            };
            var usersExpected = {
                uid1: {name: "name1", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid2: {name: "name2", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid3: {name: "name3", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid4: {name: "name4", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid5: {name: "name5", skills: ["Programming"], events: {event: {team: "team2", selection: null}}},
                uid6: {name: "name6", skills: ["Programming", "AI"], events: {event: {team: "team1", selection: null}}}
            };

            $scope.addRequests(event, users, eventName);

            expect(event).toEqual(eventExpected);
            expect(users).toEqual(usersExpected);
        });

        it("add requests to fill all the places left for all teams, less requests than places left", function() {
            var event = {
                team: {
                    team1: {
                        size: 5,
                        currentTeamSize: 3,
                        teamMembers: [
                            {uid: "uid1", name: "name1", skills: ["Programming"]},
                            {uid: "uid2", name: "name2", skills: ["Programming"]},
                            {uid: "uid3", name: "name3", skills: ["Programming"]}
                        ],
                        skills: ["Programming"],
                        teamSkills: ["Programming"]
                    }
                },
                member: {
                    uid1: {name: "name1", skills: ["Programming"], selection: null},
                    uid2: {name: "name2", skills: ["Programming"], selection: null},
                    uid3: {name: "name3", skills: ["Programming"], selection: null},
                    uid4: {name: "name4", skills: ["Programming", "AI"], selection: ["team1"]}
                }
            };
            var users = {
                uid1: {name: "name1", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid2: {name: "name2", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid3: {name: "name3", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid4: {name: "name4", skills: ["Programming", "AI"], events: {event: {team: "", selection: ["team1"]}}},
            };
            var eventName = "event";

            var eventExpected = {
                team: {
                    team1: {
                        size: 5,
                        currentTeamSize: 4,
                        teamMembers: [
                            {uid: "uid1", name: "name1", skills: ["Programming"]},
                            {uid: "uid2", name: "name2", skills: ["Programming"]},
                            {uid: "uid3", name: "name3", skills: ["Programming"]},
                            {uid: "uid4", name: "name4", skills: ["Programming", "AI"]}
                        ],
                        skills: ["Programming"],
                        teamSkills: ["Programming", "AI"]
                    }
                },
                member: {
                    uid1: {name: "name1", skills: ["Programming"], selection: null},
                    uid2: {name: "name2", skills: ["Programming"], selection: null},
                    uid3: {name: "name3", skills: ["Programming"], selection: null},
                    uid4: {name: "name4", skills: ["Programming", "AI"], selection: null},
                }
            };
            var usersExpected = {
                uid1: {name: "name1", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid2: {name: "name2", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid3: {name: "name3", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid4: {name: "name4", skills: ["Programming", "AI"], events: {event: {team: "team1", selection: null}}},
            };

            $scope.addRequests(event, users, eventName);

            expect(event).toEqual(eventExpected);
            expect(users).toEqual(usersExpected);
        });

        it("add requests to fill all the places left for all teams, no team members", function() {
            var event = {
                team: {
                    team1: {
                        size: 5,
                        currentTeamSize: 0,
                        skills: ["Programming"]
                    }
                },
                member: {
                    uid1: {name: "name1", skills: ["Programming"], selection: ["team1"]},
                    uid2: {name: "name2", skills: ["Programming"], selection: ["team1"]},
                    uid3: {name: "name3", skills: ["Programming"], selection: ["team1"]},
                    uid4: {name: "name4", skills: ["Programming"], selection: ["team1"]},
                    uid5: {name: "name5", skills: ["Programming"], selection: ["team1"]}
                }
            };
            var users = {
                uid1: {name: "name1", skills: ["Programming"], events: {event: {team: "", selection: ["team1"]}}},
                uid2: {name: "name2", skills: ["Programming"], events: {event: {team: "", selection: ["team1"]}}},
                uid3: {name: "name3", skills: ["Programming"], events: {event: {team: "", selection: ["team1"]}}},
                uid4: {name: "name4", skills: ["Programming"], events: {event: {team: "", selection: ["team1"]}}},
                uid5: {name: "name5", skills: ["Programming"], events: {event: {team: "", selection: ["team1"]}}}
            };
            var eventName = "event";

            var eventExpected = {
                team: {
                    team1: {
                        size: 5,
                        currentTeamSize: 5,
                        teamMembers: [
                            {uid: "uid1", name: "name1", skills: ["Programming"]},
                            {uid: "uid2", name: "name2", skills: ["Programming"]},
                            {uid: "uid3", name: "name3", skills: ["Programming"]},
                            {uid: "uid4", name: "name4", skills: ["Programming"]},
                            {uid: "uid5", name: "name5", skills: ["Programming"]}
                        ],
                        skills: ["Programming"],
                        teamSkills: ["Programming"]
                    }
                },
                member: {
                    uid1: {name: "name1", skills: ["Programming"], selection: null},
                    uid2: {name: "name2", skills: ["Programming"], selection: null},
                    uid3: {name: "name3", skills: ["Programming"], selection: null},
                    uid4: {name: "name4", skills: ["Programming"], selection: null},
                    uid5: {name: "name5", skills: ["Programming"], selection: null}
                }
            };
            var usersExpected = {
                uid1: {name: "name1", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid2: {name: "name2", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid3: {name: "name3", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid4: {name: "name4", skills: ["Programming"], events: {event: {team: "team1", selection: null}}},
                uid5: {name: "name5", skills: ["Programming"], events: {event: {team: "team1", selection: null}}}
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

        it("form teams for the remaining members that do not have a team", function() {
            var event = {
                admin: {param: {minTeamSize: 1, maxTeamSize: 10}},
                team: {
                    team1: {
                        size: 1,
                        currentTeamSize: 1,
                        teamMembers: [
                            {uid: "uid6", name: "name6", skills: ["AngularJS"]}
                        ],
                        skills: ["AngularJS"],
                        teamSkills: ["AngularJS"]
                    }
                },
                member: {
                    uid1: {name: "name1", skills: ["AngularJS"], selection: ["team1"]},
                    uid2: {name: "name2", skills: ["Firebase"], selection: ["team2"]},
                    uid3: {name: "name3", skills: ["Python"], selection: ["team3"]},
                    uid4: {name: "name4", skills: ["C++"], selection: ["team4"]},
                    uid5: {name: "name5", skills: ["AngularJS"], selection: ["team5"]},
                    uid6: {name: "name6", skills: ["AngularJS"], selection: null}
                }
            };
            var users = {
                uid1: {name: "name1", skills: ["AngularJS"], events: {event: {team: "", selection: ["team1"]}}},
                uid2: {name: "name2", skills: ["Firebase"], events: {event: {team: "", selection: ["team2"]}}},
                uid3: {name: "name3", skills: ["Python"], events: {event: {team: "", selection: ["team3"]}}},
                uid4: {name: "name4", skills: ["C++"], events: {event: {team: "", selection: ["team4"]}}},
                uid5: {name: "name5", skills: ["AngularJS"], events: {event: {team: "", selection: ["team5"]}}},
                uid6: {name: "name6", skills: ["AngularJS"], events: {event: {team: "team1", selection: null}}}
            };
            var eventName = "event";

            var eventExpected = {
                admin: {param: {minTeamSize: 1, maxTeamSize: 10}},
                team: {
                    atf_team1: {
                        size: 5,
                        currentTeamSize: 5,
                        teamMembers: [
                            {uid: "uid1", name: "name1", skills: ["AngularJS"]},
                            {uid: "uid2", name: "name2", skills: ["Firebase"]},
                            {uid: "uid3", name: "name3", skills: ["Python"]},
                            {uid: "uid4", name: "name4", skills: ["C++"]},
                            {uid: "uid5", name: "name5", skills: ["AngularJS"]}
                        ],
                        skills: ["AngularJS", "Firebase", "Python", "C++"],
                        teamSkills: ["AngularJS", "Firebase", "Python", "C++"]
                    },
                    team1: {
                        size: 1,
                        currentTeamSize: 1,
                        teamMembers: [
                            {uid: "uid6", name: "name6", skills: ["AngularJS"]}
                        ],
                        skills: ["AngularJS"],
                        teamSkills: ["AngularJS"]
                    }
                },
                member: {
                    uid1: {name: "name1", skills: ["AngularJS"], selection: null},
                    uid2: {name: "name2", skills: ["Firebase"], selection: null},
                    uid3: {name: "name3", skills: ["Python"], selection: null},
                    uid4: {name: "name4", skills: ["C++"], selection: null},
                    uid5: {name: "name5", skills: ["AngularJS"], selection: null},
                    uid6: {name: "name6", skills: ["AngularJS"], selection: null}
                }
            };
            var usersExpected = {
                uid1: {name: "name1", skills: ["AngularJS"], events: {event: {team: "atf_team1", selection: null}}},
                uid2: {name: "name2", skills: ["Firebase"], events: {event: {team: "atf_team1", selection: null}}},
                uid3: {name: "name3", skills: ["Python"], events: {event: {team: "atf_team1", selection: null}}},
                uid4: {name: "name4", skills: ["C++"], events: {event: {team: "atf_team1", selection: null}}},
                uid5: {name: "name5", skills: ["AngularJS"], events: {event: {team: "atf_team1", selection: null}}},
                uid6: {name: "name6", skills: ["AngularJS"], events: {event: {team: "team1", selection: null}}}
            };

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
            // mock $mdDialog confirmAutomaticTeamForm that the user confirmed the automatic team forming
            spyOn($scope, "confirmAutomaticTeamForm").and.callFake(function(callback) {
                callback(true);
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

            // mock $scope addRequests
            spyOn($scope, "addRequests").and.callFake(function(event, users, eventName) {
                return;
            });

            // mock $scope formRemaining
            spyOn($scope, "formRemaining").and.callFake(function(event, users, eventName) {
                return;
            });
        });

        beforeEach(function() {
            // mock document querySelector that a snackbar is showed for notification
            spyOn(document, "querySelector").and.callFake(function(selector) {
                return {MaterialSnackbar: {showSnackbar: function(data) {console.log("snackbar", data.message);}}};
            });
        });

        it("cancel the automatic team form", function() {
            // mock $scope confirmAutomaticTeamForm that the user cancelled the automatic team forming
            $scope.confirmAutomaticTeamForm.and.callFake(function(callback) {
                callback(false);
            });

            $scope.automaticTeamForm();
        });

        it("automatic team form", function() {
            $scope.automaticTeamForm();
        });
    });
});
