var isAvailable = function(team) {
	return team.currentTeamSize < team.size;
}

var getAvailableTeam = function (teams) {
	return teams.filter(isAvailable);
}