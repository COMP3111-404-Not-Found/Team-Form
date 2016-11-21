angular.module("teamform-user-app", ["firebase", "ngMaterial", "ngMessages"])
.controller("UserCtrl", function($scope, $firebaseObject, $firebaseArray) {
    initializeFirebase();

    $scope.user = null;

    var userRef = null;
    $scope.userObj = null;

    var skillsRef = null;
    $scope.skills = null;

    // observe the auth state change
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log(user);

            // refresh the scope
            $scope.$apply(function() {
                $scope.user = user;

                // get the user object from the database
                userRef = firebase.database().ref().child("users").child(user.uid);
                $scope.userObj = $firebaseObject(userRef);

                skillsRef = userRef.child("skills");
                $scope.skills = $firebaseArray(skillsRef);

                // change the title in the navigation to the name of the signed in user
                $(".mdl-layout>.mdl-layout__header>.mdl-layout__header-row>.mdl-layout__title").html($scope.user.displayName);
            });
        } else {
            // No user is signed in.
            console.log('no user is signed in');

            // refresh the scope
            $scope.$apply(function() {
                $scope.user = null;

                userRef = null;
                $scope.userObj = null;

                skillsRef = null;
                $scope.skills = null;

                // change the title in the navigation to "User"
                $(".mdl-layout>.mdl-layout__header>.mdl-layout__header-row>.mdl-layout__title").html("User");
            });
        }
    });


    $scope.skillInput = null;

    // add skill function
    $scope.addSkill = function() {
        // return if no user is signed in
        if (!$scope.user) {
            return;
        }

        // return if the skill input is invalid
        if (!$scope.skillInput) {
            return;
        }

        var skillsArray = $firebaseArray(skillsRef);
        skillsArray.$loaded().then(function(skills) {
            var skill = {};
            skill[skills.length.toString()] = $scope.skillInput;

            // add the skill to the user's profile
            skillsRef.update(skill);

            // add the skill to the member object of all the events that the user joined
            for (var i in $scope.userObj.events) {
                var eventRef = firebase.database().ref().child("events").child(i).child("member").child($scope.user.uid).child("skills");
                eventRef.update(skill);
            }

            $scope.skillInput = null;
            $("#skillInput").blur();
        });
    };


    // recommendations
    $scope.recommendations = [
        {
            eventName: "event_name",
            teams: [
                {
                    teamName: "team_name",
                    placesLeft: 1,
                    skillsMatch: {
                        match: ["AngularJS", "Firebase"],
                        number: 1
                    }
                }
            ]
        }
    ];
})
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('orange')
    .accentPalette('indigo');
});
