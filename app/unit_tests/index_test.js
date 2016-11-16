describe("Index Controller", function() {
    beforeEach(module("teamform-index-app"));

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

    describe("$scope.login", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("IndexCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});   
        });

        it("login", function() {
            $scope.login();
        });
    });


    describe("$scope.logout", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("IndexCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});   
        });

        it("logout", function() {
            $scope.logout();
        });
    });


    describe("$scope.createEvent", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("IndexCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});   
        });

        it("create event", function() {
            $scope.createEvent();
        });
    });


    describe("$scope.joinEvent", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("IndexCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});   
        });

        it("join event", function() {
            $scope.user = {
                uid: "uid",
                displayName: "displayName"
            };
            $scope.joinEvent("test");
        });
    });
});
