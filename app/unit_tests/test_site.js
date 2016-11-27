describe('Test site.js', function() {
    //
    // Example: A test case of getRandomIntInclusive
    //
    describe('getRandomIntInclusive Coverage Test', function() {

        it('value within 1 to 3', function() {
            var value = getRandomIntInclusive(1, 3);
            expect( value>=1 && value <= 3 ).toEqual(true);
        });

    });


	describe("retrieveOnceFirebase", function() {
		it("retrieveOnceFirebase", function() {
			var firebase = {database: function() {return {ref: function(refPath) {return {once: function(value) {return {then: function(callback) {callback();}};}};}};}};
			var refPath = "/";

			retrieveOnceFirebase(firebase, refPath, function() {

			});
		});
	});
});
