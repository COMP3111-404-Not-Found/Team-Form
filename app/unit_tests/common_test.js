describe('Test site.js', function() {
	
    //
    // Example: A test case of getAvailableTeam
    //
    describe('getAvailableTeam Coverage Test', function() {

        it('returns available teams from a list of teams', function() {
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

            var answer = getAvailableTeam(teams);
            expect(answer = [{
				currentTeamSize: 1,
				size: 5,
				skills: ["C++"],
				teamMembers:[{name:"STO", uid:"qwertyqwerty"}]
			}]).toEqual(true);
        });

    });

});
