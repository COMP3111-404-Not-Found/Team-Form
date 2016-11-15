
function isAvailable(team) {
    return team.currentTeamSize < team.size;
}


function getAvailableTeam(teams) {
    return teams.filter(isAvailable);
}

function insufficientMemberTeams(teams)
{
    var insufficentTeams = getAvailableTeam(teams);

    //if(insufficentTeams.length===0)
        //return;

    var uids ;
    for( i=0; i<insufficentTeams.length; i++)
    {
        for(var j=0; j<insufficentTeams[i].teamMembers.length; j++)
        {
            uids.push(insufficentTeams[i].teamMembers[j].uid);

        }
    }
    return uids;

}
