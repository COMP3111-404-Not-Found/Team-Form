$(document).ready(function(){

	$('#team_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event name: " + eventName);
	}

});

angular.module('teamform-team-app', ['firebase', 'ngMaterial'])
.controller('TeamCtrl', ['$scope', '$firebaseObject', '$firebaseArray',























	function($scope, $firebaseObject, $firebaseArray) {
	// Call Firebase initialization code defined in site.js
	initializeFirebase();

	var refPath = "";
	var eventName = getURLParameter("q");
	// TODO: implementation of MemberCtrl
	$scope.param = {
		"teamName" : '',
		"currentTeamSize" : 0,
		"teamMembers" : [],
		"skills" : []
	};

	refPath =  eventName + "/admin";
	retrieveOnceFirebase(firebase, refPath, function(data) {
		if ( data.child("param").val() != null ) {
			$scope.range = data.child("param").val();
			$scope.param.currentTeamSize = parseInt(($scope.range.minTeamSize + $scope.range.maxTeamSize)/2);
			$scope.$apply(); // force to refresh
			$('#team_page_controller').show(); // show UI
		}
	});

	refPath = eventName + "/member";
	$scope.member = [];
	$scope.member = $firebaseArray(firebase.database().ref(refPath));
	refPath = eventName + "/team";
	$scope.team = [];
	$scope.team = $firebaseArray(firebase.database().ref(refPath));

	$scope.requests = [];
	$scope.refreshViewRequestsReceived = function() {
		//$scope.test = "";
		$scope.requests = [];
		var teamID = $.trim( $scope.param.teamName );

		$.each($scope.member, function(i,obj) {
			//$scope.test += i + " " + val;
			//$scope.test += obj.$id + " " ;

			var userID = obj.$id;
			if ( typeof obj.selection != "undefined"  && obj.selection.indexOf(teamID) > -1 ) {
				//$scope.test += userID + " " ;
				$scope.requests.push(userID);
			}
		});
		$scope.$apply();
	}
	$scope.changeCurrentTeamSize = function(delta) {
		var newVal = $scope.param.currentTeamSize + delta;
		if (newVal >= $scope.range.minTeamSize && newVal <= $scope.range.maxTeamSize ) {
			$scope.param.currentTeamSize = newVal;
		}
	}
	$scope.saveFunc = function() {
		var teamID = $.trim( $scope.param.teamName );
		if ( teamID !== '' ) {
			var newData = {
				'size': $scope.param.currentTeamSize,
				'teamMembers': $scope.param.teamMembers,
			};
			var refPath = getURLParameter("q") + "/team/" + teamID;
			var ref = firebase.database().ref(refPath);
			// for each team members, clear the selection in /[eventName]/team/
			$.each($scope.param.teamMembers, function(i,obj){
				//$scope.test += obj;
				var rec = $scope.member.$getRecord(obj);
				rec.selection = [];
				$scope.member.$save(rec);
			});
			ref.set(newData, function(){
				// console.log("Success..");
				// Finally, go back to the front-end
				// window.location.href= "index.html";
			});
		}
	};
	$scope.addSkill = function() {







}]);
