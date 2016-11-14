describe('Test common_test.js', function() {
	
    //
    // A test case of missingSkillsMatched
    //
    describe('missingSkillsMatched Coverage Test', function() {

        it('returns match of missing skills of team and skills of user', function() {
        	var team = {

        		currentTeamSize: 1,
        		size: 5,
        		preferredSkills: ["C++", "java", "php"],
        		teamMembers:[{name:"Shermin", uid:"blah", skills:"C++"}],
				foundSkills: ["C++"],
        	};

        	var user ={
				name:"Pooja",
				uid:"meh",
        		skills:["C++","php"],
        	};

            var missingMatched = missingSkillsMatched(team.preferredSkills, team.foundSkills, user.skills);
            var expected = ["php"];
            expect(matched).toEqual(expected);
        });

    });

});
