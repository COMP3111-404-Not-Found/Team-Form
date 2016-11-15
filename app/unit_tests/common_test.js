describe('Test common_test.js', function() {
	
    //
    // A test case of matchedSkills
    //
    describe('getMatchedSkills Coverage Test', function() {

        it('returns matched skills of team and user', function() {
        	var team = {

        		currentTeamSize: 1,
        		size: 5,
        		preferredSkills: ["C++", "java", "php"],
        		teamMembers:[{name:"STO", uid:"qwertyqwerty"}]
        	};

        	var user ={
        		username:"user1",
        		skills:["C++","php"],
        		preferredTeams:["team1", "team5"]

        	};

            var matched = isMatched(team.preferredSkills, user.skills);
            var expected = ["C++","php"];
            
            expect(matched.match).toEqual(expected);
            expect(matched.number).toEqual(1);
        });

    });

});
