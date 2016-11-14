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
	return filteredArray;	
}
