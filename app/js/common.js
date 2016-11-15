
function isAvailable(team) {
    return team.currentTeamSize < team.size;
}


function getAvailableTeam(teams) {
    return teams.filter(isAvailable);
}

function insufficientMemberTeams(teams)
{
    var insufficientTeams = getAvailableTeam(teams);

    var uids= [] ;
    for( i=0; i<insufficientTeams.length; i++)
    {
        for(var j=0; j<insufficientTeams[i].teamMembers.length; j++)
        {
            uids.push(insufficientTeams[i].teamMembers[j].uid);

        }
    }
    return uids;

}
