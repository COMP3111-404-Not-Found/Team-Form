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


    // A test case of missingSkillsMatched
    describe('missingSkillsMatched Coverage Test', function() {
        it("the team does not have any preferred skills (skills = undefined)", function() {
            var skills = undefined;
            var teamSkills = undefined;
            var userSkills = ["Programming"];

            expect(missingSkillsMatched(skills, teamSkills, userSkills)).toEqual({match: [], number: 0});
        });

        it("the user does not have any skills (userSkills = undefined)", function() {
            var skills = ["Programming"];
            var teamSkills = undefined;
            var userSkills = undefined;

            expect(missingSkillsMatched(skills, teamSkills, userSkills)).toEqual({match: [], number: 0});
        });

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
            expect(missingMatched.match).toEqual(expected);
            expect(missingMatched.number).toEqual(1);
        });

    });


    // A test case of matchedSkills
    describe('getMatchedSkills Coverage Test', function() {
        it("the team does not have any preferred skills (skills = undefined)", function() {
            var skills = undefined;
            var userSkills = ["Programming"];

            expect(isMatched(skills, userSkills)).toEqual({match: [], number: 0});
        });

        it("the user does not have any skills (userSkills = undefined)", function() {
            var skills = ["Programming"];
            var userSkills = undefined;

            expect(isMatched(skills, userSkills)).toEqual({match: [], number: 0});
        });

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
            expect(matched.number).toEqual(2);
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


    // A test case of teams with insufficient members
    describe('insufficientMemberTeams Coverage Test', function() {

        it('returns uid of all members in teams with insufficient members', function() {
            var teams =[{

                currentTeamSize: 1,
                size: 5,
                preferredSkills: ["C++", "java", "php"],
                teamMembers:[{name:"Shermin", uid:"shermin"}]
            },

              {

                currentTeamSize: 2,
                size: 5,
                preferredSkills: ["C++", "java", "php"],
                teamMembers:[{name:"Man", uid:"man"},
                {name:"Andrew", uid:"andrew"}]
            }];

            var matched = insufficientMemberTeams(teams);
            var expected = ["shermin","man","andrew"];
            expect(matched).toEqual(expected);
        });

    });
});
