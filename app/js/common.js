/**
 * calculate the number of skills matched
 *
 * @param preferredSkills preferred skills of a team
 * @param currentSkills skills of the signed in user
 * @return skills match and number of skills matched
 */
function isMatched(preferredSkills, currentSkills){
	var filteredArray = preferredSkills.filter(
	function(each){
		for (var i=0;i<currentSkills.length;i++){
			if(each==currentSkills[i]){
				return true;
			}
		}
		return false;
	}
	);
	return {match: filteredArray, number: filteredArray.length};	
}
