describe("Eventteam Controller", function() {
    beforeEach(module("teamform-eventteam-app"));

    var $controller, $firebaseObject, $firebaseArray;

    beforeEach(inject(function(_$controller_, _$firebaseObject_, _$firebaseArray_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $firebaseObject = _$firebaseObject_;
        $firebaseArray = _$firebaseArray_;
    }));

    describe("$scope.filterPlaces", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("EventTeamCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        it("filter teams that still have places left", function() {
            expect($scope.filterPlaces()).toEqual(6);
        });
    });
});