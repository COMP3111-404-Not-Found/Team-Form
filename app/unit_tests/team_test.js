describe("Team Functions", function() {
    describe("removeTeamSkills", function() {
        it("test removeTeamSkills", function() {
            var teamSkills = ["Python", "C++", "AngularJS", "Firebase"];
            var teamMembers = [
                {uid: "0", name: "member to be removed", skills: ["Python", "C++", "AngularJS", "Firebase"]},
                {uid: "1", name: "team member 1", skills: ["AngularJS", "Firebase"]}
            ];
            var member = {uid: "0", name: "Man", skills: ["Python", "C++", "AngularJS", "Firebase"]};

            var expected = ["AngularJS", "Firebase"];

            expect(removeTeamSkills(teamSkills, teamMembers, member)).toEqual(expected);
        });

        it("other members does not have the skills", function() {
            var teamSkills = ["AngularJS", "Firebase"];
            var teamMembers = [
                {uid: "0", name: "member to be removed", skills: ["Firebase"]},
                {uid: "1", name: "team member 1", skills: ["AngularJS"]}
            ];
            var member = {uid: "0", name: "Man", skills: ["Firebase"]};

            var expected = ["AngularJS"];

            expect(removeTeamSkills(teamSkills, teamMembers, member)).toEqual(expected);
        });

        it("other members have the skills", function() {
            var teamSkills = ["AngularJS"];
            var teamMembers = [
                {uid: "0", name: "member to be remove", skills: ["AngularJS"]},
                {uid: "1", name: "team member 1", skills: ["AngularJS"]}
            ];
            var member = {uid: "0", name: "Man", skills: ["AngularJS"]};

            var expected = ["AngularJS"];

            expect(removeTeamSkills(teamSkills, teamMembers, member)).toEqual(expected);
        });
    });
});


describe("Team Controller", function() {
    beforeEach(module("teamform-team-app"));

    var $controller, $firebaseObject, $firebaseArray;

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
                teamMembers: {
                    0: {uid: "uid", name: "member", skills: {0: "Programming"}}
                },
                teamSkills: ["Programming"]
            }
        }
    };

    var memberObj = {
        member: {
            uid: {
                name: "member",
                skills: {0: "Programming"}
            },
            uid1: {
                $id: "uid1",
                name: "member1",
                skills: {0: "Programming"},
                selection: ["team", "test"]
            }
        }
    }

    beforeEach(inject(function(_$controller_, _$firebaseObject_, _$firebaseArray_) {
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

            // https://team-form-4ffd7.firebaseio.com/.../team/...
            if (refUrlSplit[refUrlSplitLength-2] === "team") {
                var obj = teamObj.team.team;
                obj.$loaded = function() {return {then: function(callback) {callback(teamObj.team.team);}};};

                return obj;
            }
        });

        // mock $firebaseArray
        $firebaseArray = jasmine.createSpy("$firebaseArray");
        $firebaseArray.and.callFake(function(ref) {
            var refUrl = ref.toString();
            var refUrlSplit = refUrl.split("/");
            var refUrlSplitLength = refUrlSplit.length;

            // https://team-form-4ffd7.firebaseio.com/.../team/.../teamMembers
            if (refUrlSplit[refUrlSplitLength-3] === "team" && refUrlSplit[refUrlSplitLength-1] === "teamMembers") {
                var obj = teamObj.team.team.teamMembers;
                obj.$loaded = function() {return {then: function(callback) {callback(teamObj.team.team.teamMembers);}};};

                return obj;
            }

            // https://team-form-4ffd7.firebaseio.com/.../team/.../skills
            if (refUrlSplit[refUrlSplitLength-3] === "team" && refUrlSplit[refUrlSplitLength-1] === "skills") {
                var obj = teamObj.team.team.skills;
                obj.$loaded = function() {return {then: function(callback) {callback(teamObj.team.team.skills);}};};

                return obj;
            }

            // https://team-form-4ffd7.firebaseio.com/.../team/.../teamSkills
            if (refUrlSplit[refUrlSplitLength-3] === "team" && refUrlSplit[refUrlSplitLength-1] === "teamSkills") {
                var obj = teamObj.team.team.teamSkills;
                obj.$loaded = function() {return {then: function(callback) {callback(teamObj.team.team.teamSkills);}};};

                return obj;
            }

            // https://team-form-4ffd7.firebaseio.com/.../member
            if (refUrlSplit[refUrlSplitLength-1] === "member") {
                var obj = memberObj.member;
                obj.$loaded = function() {return {then: function(callback) {callback(memberObj.member);}};};

                return obj;
            }
        });
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

    beforeEach(function() {
        // mock document querySelector that a snackbar is showed for notification
        spyOn(document, "querySelector").and.callFake(function(selector) {
            if (selector === ".mdl-js-snackbar") {
                return {MaterialSnackbar: {showSnackbar: function(data) {console.log("snackbar", data.message);}}};
            }
        });
    });

    afterEach(function() {
        firebase.app().delete();
    });


    describe("firebase authentication", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("TeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        beforeEach(function() {
            var user = {uid: "uid", displayName: "name"};

            // mock firebase auth onAuthStateChanged that a user is signed in
            spyOn(firebase.auth.Auth.prototype, "onAuthStateChanged").and.callFake(function(callback) {
                callback(user);
            });

            // mock $scope.$apply
            $scope.$apply = jasmine.createSpy("$apply").and.callFake(function(callback) {
                callback();
            });
        });

        it("user is signed in", function() {

        });

        it("no user is signed in", function() {
            // mock firebase auth onAuthStateChanged that no user is signed in
            firebase.auth.Auth.prototype.onAuthStateChanged.and.callFake(function(callback) {
                callback(null);
            });

            expect($scope.user).toBeNull();
            expect($scope.userObj).toBeNull();
        });
    });


    describe("load data", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("TeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        it("load data", function() {
            expect($scope.minTeamSize).toEqual(adminObj.admin.param.minTeamSize);
            expect($scope.maxTeamSize).toEqual(adminObj.admin.param.maxTeamSize);

            expect($scope.size).toEqual(teamObj.team.team.size);
            expect($scope.currentTeamSize).toEqual(teamObj.team.team.currentTeamSize);

            expect($scope.members).toEqual(teamObj.team.team.teamMembers);

            expect($scope.skills).toEqual(teamObj.team.team.skills);

            expect($scope.teamSkills).toEqual(teamObj.team.team.teamSkills);

            expect($scope.requests).toEqual([
                {uid: "uid1", name: "member1", skills: {0: "Programming"}}
            ]);
        });
    });


    describe("$scope.changeCurrentTeamSize", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("TeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        it("invalid size ($scope.size + change < $scope.currentTeamSize", function() {
            $scope.size = 5;
            $scope.currentTeamSize = 5;
            $scope.minTeamSize = 1;
            $scope.maxTeamSize = 10;

            $scope.changeCurrentTeamSize(-1);

            expect($scope.size).toEqual(5);
        });

        it("invalid size ($scope.size + change < $scope.minTeamSize", function() {
            $scope.size = 5;
            $scope.currentTeamSize = 4;
            $scope.minTeamSize = 1;
            $scope.maxTeamSize = 10;

            $scope.changeCurrentTeamSize(-5);

            expect($scope.size).toEqual(5);
        });

        it("invalid size ($scope.size + change > $scope.maxTeamSize", function() {
            $scope.size = 5;
            $scope.currentTeamSize = 4;
            $scope.minTeamSize = 1;
            $scope.maxTeamSize = 10;

            $scope.changeCurrentTeamSize(6);

            expect($scope.size).toEqual(5);
        });

        it("increase size", function() {
            $scope.size = 5;
            $scope.currentTeamSize = 4;
            $scope.minTeamSize = 1;
            $scope.maxTeamSize = 10;

            $scope.changeCurrentTeamSize(1);

            expect($scope.size).toEqual(6);
        });

        it("decrease size", function() {
            $scope.size = 5;
            $scope.currentTeamSize = 4;
            $scope.minTeamSize = 1;
            $scope.maxTeamSize = 10;

            $scope.changeCurrentTeamSize(-1);

            expect($scope.size).toEqual(4);
        });
    });


    describe("$scope.addMember", function() {
        var $scope, controller;

        var request = null;

        beforeEach(function() {
            $scope = {};
            controller = $controller("TeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        beforeEach(function() {
            // mock addTeamSkills
            addTeamSkills = jasmine.createSpy("addTeamSkills");
            addTeamSkills.and.callFake(function(teamSkills, userSkills) {
                return ["Programming"];
            });
        });

        beforeEach(function() {
            request = {
                uid: "uid",
                name: "name",
                skills: ["Programming"]
            };

            $scope.size = 5;
            $scope.currentTeamSize = 0;

            $scope.requests = [
                {uid: "uid", name: "name", skills: ["Programming"]}
            ];
        });

        it("the team is full already ($scope.currentTeamSize > $scope.size", function() {
            $scope.size = 5;
            $scope.currentTeamSize = 6;

            $scope.addMember(request);
        });

        it("the team is full already ($scope.currentTeamSize = $scope.size", function() {
            $scope.size = 5;
            $scope.currentTeamSize = 5;

            $scope.addMember(request);
        });

        it("add the member request", function() {
            $scope.addMember(request);

            expect(firebase.database.Reference.prototype.update).toHaveBeenCalledWith({0: {uid: "uid", name: "name", skills: ["Programming"]}});
            expect(firebase.database.Reference.prototype.set).toHaveBeenCalledWith(["Programming"]);
            expect(firebase.database.Reference.prototype.update).toHaveBeenCalledWith({selection: null});
            expect(firebase.database.Reference.prototype.update).toHaveBeenCalledWith({team: "test", selection: null});
            expect(firebase.database.Reference.prototype.update).toHaveBeenCalledWith({currentTeamSize: 1});
            expect($scope.requests).toEqual([]);
            expect($scope.currentTeamSize).toEqual(1);
        });
    });


    describe("$scope.removeMember", function() {
        var $scope, controller;

        var member = null;

        beforeEach(function() {
            $scope = {};
            controller = $controller("TeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        beforeEach(function() {
            // mock removeTeamSkills
            removeTeamSkills = jasmine.createSpy("removeTeamSkills");
            removeTeamSkills.and.callFake(function(teamSkillsArray, membersArray, member) {
                return [];
            });
        });

        beforeEach(function() {
            member = {
                uid: "uid",
                name: "name",
                skills: ["Programming"]
            };

            $scope.members = {
                0: {uid: "uid", name: "name", skills: ["Programming"]},
                $remove: function() {
                    console.log("$remove");
                }
            };

            $scope.currentTeamSize = 1;
        });

        it("remove the member", function() {
            $scope.removeMember(member);

            expect(firebase.database.Reference.prototype.set).toHaveBeenCalledWith([]);
            expect(firebase.database.Reference.prototype.update).toHaveBeenCalledWith({team: ""});
            expect(firebase.database.Reference.prototype.update).toHaveBeenCalledWith({currentTeamSize: 0});
            expect($scope.currentTeamSize).toEqual(0);
        });
    });


    describe("$scope.addSkill", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("TeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        beforeEach(function() {
            $scope.skillInput = "Programming";
        });

        it("add the preferred skill", function() {
            $scope.addSkill();

            expect(firebase.database.Reference.prototype.update).toHaveBeenCalledWith({1: "Programming"});
            expect($scope.skillInput).toBeNull();
        });
    });
});
