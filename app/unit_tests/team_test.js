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

    beforeEach(inject(function(_$controller_, _$firebaseObject_, _$firebaseArray_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $firebaseObject = _$firebaseObject_;
        $firebaseArray = _$firebaseArray_;
    }));

    describe("$scope.changeCurrentTeamSize", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("TeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        it("increase size", function() {
            $scope.size = 5;
            $scope.currentTeamSize = 4;
            $scope.minTeamSize = 1;
            $scope.maxTeamSize = 10;

            $scope.changeCurrentTeamSize(1);

            expect($scope.size).toEqual(6);
        });

        // it("decrease size", function() {
        //     $scope.size = 5;
        //     $scope.currentTeamSize = 4;
        //     $scope.minTeamSize = 1;
        //     $scope.maxTeamSize = 10;
        //
        //     $scope.changeCurrentTeamSize(-1);
        //
        //     expect($scope.size).toEqual(4);
        // });
    });
});
