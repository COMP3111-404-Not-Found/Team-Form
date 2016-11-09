var getAvailableTeam = function (teams) {
	var output = [];
	teams.forEach(function(team) {
		if (team.currentTeamSize < team.size)
			output.push(team); 
	});
	return output;
}