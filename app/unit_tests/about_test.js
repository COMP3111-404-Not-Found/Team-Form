describe("About Controller", function() {
    beforeEach(module("teamform-about-app"));

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

    describe("about controller all", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("AboutCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        it("about controller all test 1", function() {

        });
    });
});
