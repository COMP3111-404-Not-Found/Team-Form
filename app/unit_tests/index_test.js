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


    describe("firebase authentication", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("IndexCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            // mock firebase auth getRedirectResult that the sign in is successful
            spyOn(firebase.auth.Auth.prototype, "getRedirectResult").and.callFake(function() {
                return {then: function(callback) {callback({credential: {accessToken: "access token"}, user: {}}); return {catch: function(callback) {}}}};
            });
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

        it("sign in is successful", function() {

        });

        it("sign in is successful, no credential", function() {

        });

        it("sign in is unsuccessful", function() {
            firebase.auth.Auth.prototype.getRedirectResult.and.callFake(function() {
                return {then: function(callback) {return {catch: function(callback) {callback({code: "code", message: "message", email: "email", credential: "credential"});}}}};
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
        });
    });


    describe("$scope.login", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("IndexCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray, $window: $window, $mdDialog: $mdDialog});
        });

        beforeEach(function() {
            // mock firebase auth signInWithRedirect
            spyOn(firebase.auth.Auth.prototype, "signInWithRedirect").and.callFake(function(provider) {
                console.log("sign in with redirect");
            });
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

        beforeEach(function() {
            // mock firebase auth signOut
            spyOn(firebase.auth.Auth.prototype, "signOut").and.callFake(function() {
                console.log("sign out");
                return {then: function(signOutSuccessfulCallback, signOutErrorCallback) {}};
            });
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
