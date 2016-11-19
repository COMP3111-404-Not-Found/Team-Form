describe('Team', function() {
    describe('addTeamSkills', function() {
        it('test addTeamSkills', function() {
            var teamSkills = ["AngularJS", "Firebase"];
            var userSkills = ["Python", "C++", "AngularJS", "Firebase"];

            var expected = ["AngularJS", "Firebase", "Python", "C++"];

            expect(addTeamSkills(teamSkills, userSkills)).toEqual(expected);
        });

        it('the team does not have the skills yet', function() {
            var teamSkills = ["AngularJS"];
            var userSkills = ["Firebase"];

            var expected = ["AngularJS", "Firebase"];

            expect(addTeamSkills(teamSkills, userSkills)).toEqual(expected);
        });

        it('the team has the skills already', function() {
            var teamSkills = ["AngularJS"];
            var userSkills = ["AngularJS"];

            var expected = ["AngularJS"];

            expect(addTeamSkills(teamSkills, userSkills)).toEqual(expected);
        });
    });


    describe('removeTeamSkills', function() {
        it('test removeTeamSkills', function() {
            var teamSkills = ["Python", "C++", "AngularJS", "Firebase"];
            var teamMembers = [
                {uid: "0", name: "member to be removed", skills: ["Python", "C++", "AngularJS", "Firebase"]},
                {uid: "1", name: "team member 1", skills: ["AngularJS", "Firebase"]}
            ];
            var member = {uid: "0", name: "Man", skills: ["Python", "C++", "AngularJS", "Firebase"]};

            var expected = ["AngularJS", "Firebase"];

            expect(removeTeamSkills(teamSkills, teamMembers, member)).toEqual(expected);
        });

        it('other members does not have the skills', function() {
            var teamSkills = ["AngularJS", "Firebase"];
            var teamMembers = [
                {uid: "0", name: "member to be removed", skills: ["Firebase"]},
                {uid: "1", name: "team member 1", skills: ["AngularJS"]}
            ];
            var member = {uid: "0", name: "Man", skills: ["Firebase"]};

            var expected = ["AngularJS"];

            expect(removeTeamSkills(teamSkills, teamMembers, member)).toEqual(expected);
        });

        it('other members have the skills', function() {
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
                skills: {0: "Programming"},
                teamMembers: {
                    0: {uid: "uid", name: "member", skills: {0: "Programming"}}
                },
                teamSkills: {0: "Programming"}
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

    afterEach(function() {
        firebase.app().delete();
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
            request = {
                uid: "uid",
                displayName: "name"
            };
        });

        it("the team is full already ($scope.currentTeamSize >= $scope.size", function() {
            $scope.currentTeamSize = 5;
            $scope.size = 5;

            $scope.addMember(request);
        });

        /*it("add the member request", function() {
            $scope.currentTeamSize = 4;
            $scope.size = 5;

            $scope.addMember();
        });*/
    });


    describe("$scope.removeMember", function() {
        var $scope, controller;

        var member = null;

        beforeEach(function() {
            $scope = {};
            controller = $controller("TeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        beforeEach(function() {
            member = {
                uid: "uid",
                displayName: "name"
            };
        });

        /*it("remove the member", function() {
            $scope.removeMember(member);
        });*/
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

        /*it("add the preferred skill", function() {
            $scope.addSkill();
        });*/
    });
});
