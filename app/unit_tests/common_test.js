describe('Test common', function() {
    // A test case of getAvailableTeam
    describe('getAvailableTeam Coverage Test', function() {
        it('returns available teams from a list of teams', function() {
        	var teams = [
        	{
        		currentTeamSize: 1,
        		size: 5,
        		skills: ["C++"],
        		teamMembers: [{name:"STO", uid:"qwertyqwerty"}]
        	},
        	{
        		currentTeamSize: 4,
        		size: 4,
        		skills: ["C++"],
        		teamMembers: []
        	}];

            var answer = getAvailableTeam(teams);
            var expected = [{
				currentTeamSize: 1,
				size: 5,
				skills: ["C++"],
				teamMembers: [{name:"STO", uid:"qwertyqwerty"}]
			}];

            expect(answer).toEqual(expected);
        });
    });


    // A test case of MembersWithNoTeam
    describe('MembersWithNoTeam Coverage Test', function() {
        it('returns members who do not have a team yet', function() {
        	var members = [
        	{
        		name: "Shermin",
        		uid: "123",
        		skills: ["C++"],
        		team: "404-notfound",
        	},
			{
        		name: "RandomGirl",
        		uid: "678",
        		skills: ["Java"],

        	}];

            var noTeam = membersWithNoTeam(members);
            var expected = [
			{
        		name: "RandomGirl",
        		uid: "678",
        		skills: ["Java"],

        	}];

            expect(noTeam).toEqual(expected);
        });
		
		it('returns members who have an undefined team', function() {
        	var members = [
        	{
        		name: "Shermin",
        		uid: "123",
        		skills: ["C++"],
        		team: "404-notfound",
        	},
        	{
        		name: "RandomGuy",
        		uid: "456",
        		skills: ["php"],
        		team: undefined,
        	}];

            var noTeam = membersWithNoTeam(members);
            var expected = [{
				name: "RandomGuy",
        		uid: "456",
        		skills: ["php"],
        		team: undefined,
			}];

            expect(noTeam).toEqual(expected);
        });
    });
});
