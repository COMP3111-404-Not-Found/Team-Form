

describe('Test common_test.js', function() {
    //
    // A test case of teams with insufficient members 
    //
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
            var expected = [{
                currentTeamSize: 1,
                size: 5,
                skills: ["C++"],
                teamMembers:[{name:"STO", uid:"qwertyqwerty"}]
            }]
            expect(answer).toEqual(expected);
        });

    });

});