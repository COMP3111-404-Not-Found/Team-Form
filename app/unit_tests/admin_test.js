describe("Admin Controller", function() {
    beforeEach(module("teamform-admin-app"));

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

    describe("$scope.changeMinTeamSize", function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
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
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
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


    /*describe("$scope.saveFunc", function() {
        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        beforeEach(function() {
            $scope.param = {
                $save: function() {
                    console.log("saved");
                }
            };
        });

        it("save", function() {
            $scope.saveFunc();
        });
    });*/


    describe("$scope.startChange", function() {
        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        it("set the minimum date when the start date changes", function() {
            $scope.startDate = new Date();
            $scope.minDate = null;

            $scope.startChange();

            expect($scope.minDate).toEqual($scope.startDate);
        });
    });


    describe("$scope.saveContent", function() {
        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
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

        /*it("save the details of the event", function() {
            $scope.saveContent();
        });*/
    });


    describe("$scope.zeroMember", function() {
        beforeEach(function() {
            $scope = {};
            controller = $controller("AdminCtrl", {$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
        });

        it("the team does not have any members (teamMembers === null)", function() {
            teamMembers = null;

            var output = $scope.zeroMember(teamMembers);

            expect(output).toEqual(false);
        });

        it("the team does not have any members (teamMembers !== null)", function() {
            teamMembers = [
                {
                    uid: "uid",
                    displayName: "name"
                }
            ];

            var output = $scope.zeroMember(teamMembers);

            expect(output).toEqual(true);
        });
    });
});
