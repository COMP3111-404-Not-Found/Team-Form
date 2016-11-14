/*
- function (input: preferred skills of a team, skills already satisfied by other members, skills of the current user,
			output: number of missing skills matched)
*/
function missingSkillsMatched(preferredSkills, foundSkills, currentSkills){
	var missingSkillsArray = preferredSkills.filter(
	function(each){
		for (var i=0;i<foundSkills.length;i++){
			if(each!=foundSkills[i]){
				return true;
			}
		}
		return false;
	}
	);
	var missingSkillsMatchedArray = missingSkillsArray.filter(
	function(each2){
		for (var i=0;i<currentSkills.length;i++){
			if(each2==currentSkills[i]){
				return true;
			}
		}
		return false;
	}
	);
	return missingSkillsMatchedArray;
}




	

