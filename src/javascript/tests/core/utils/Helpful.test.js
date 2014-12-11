describe("Helpful", function() {

    var helpful = App.Helpful;

    it("should verify that method exists", function() {
        expect(helpful.isNull).toBeDefined();
    });

    it("should be able to verify is value is null", function() {
        expect(helpful.isNull("some value")).toEqual(false);
    });

    it("should be able to verify that value is NULL when pass undefined", function() {
        expect(helpful.isNull(undefined)).toEqual(true);
    });

    it("should return false when pass null value", function() {
        expect(helpful.isNull(null)).toEqual(true);
    });

});
