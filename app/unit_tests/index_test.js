describe("Index Controller", function() {
    beforeEach(module("teamform-index-app"));

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

    describe("$scope.login", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("IndexCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        it("login", function() {
            $scope.login();
        });
    });


    describe("$scope.logout", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("IndexCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        it("logout", function() {
            $scope.logout();
        });
    });


    describe("$scope.createEvent", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("IndexCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            // mock $window.open
            spyOn($window, "open").and.callFake(function(url, name) {
                console.log("open " + url + " in " + name);
            });

            // mock $mdDialog.show
            spyOn($mdDialog, "show").and.callFake(function(options) {
                return {then: function(callback) {callback("event")}};
            });
        });

        it("create event", function() {
            $scope.createEvent();

            expect($mdDialog.show).toHaveBeenCalled();
            expect($window.open).toHaveBeenCalledWith("admin.html?event=event", "_self");
        });
    });


    describe("$scope.joinEvent", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("IndexCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            spyOn($firebaseObject.prototype, "$loaded").and.callFake(function() {
                return {then: function(callback) {callback({skills: ["Programming"]});}};
            });
        });

        beforeEach(function() {
            $scope.user = {
                uid: "uid",
                displayName: "name"
            };
        });

        it("join event", function() {
            $scope.joinEvent("event");

            expect(firebase.database.Reference.prototype.update).toHaveBeenCalledWith({team: ""});
            expect(firebase.database.Reference.prototype.update).toHaveBeenCalledWith({uid: {name: "name", skills: ["Programming"]}});
        });
    });
});
