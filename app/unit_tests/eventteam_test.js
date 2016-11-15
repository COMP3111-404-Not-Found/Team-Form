describe("Eventteam Controller", function() {
    beforeEach(module("teamform-eventteam-app"));

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

    describe("$scope.filterPlaces", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("EventTeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
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
});