var teams = [
{
	currentTeamSize: 1,
	size: 5,
	skills: ["C++"],
	teamMembers:[{name:"STO", uid:"qwertyqwerty"}]
},
{
	currentTeamSize: 4,
	size: 4,
	skills: ["C++"],
	teamMembers:[]
}];

var getAvailableTeam = function (teams) {
	var output = [];
	teams.foreach(function(team) {
		if (team.size === team.currentTeamSize)
			output.push(team); 
	});
	return output;
}