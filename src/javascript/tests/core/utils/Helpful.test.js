describe("Helpful", function() {
    var el = document.createElement("div");
    el.id = 'stage';
    document.body.appendChild(el);

    var helpful = App.Helpful;

    it("should verify that method isNull exists", function() {
        expect(helpful.isNull).toBeDefined();
    });

    it("should be able to verify that value is not null", function() {
        expect(helpful.isNull("some value")).toEqual(false);
    });

    it("should be able to verify that value is NULL when pass undefined", function() {
        expect(helpful.isNull(undefined)).toEqual(true);
    });

    it("should return false when pass null value", function() {
        expect(helpful.isNull(null)).toEqual(true);
    });

    it("should verify that method isNumber exists", function() {
        expect(helpful.isNumber).toBeDefined();
    });

    it("should be able to verify that value is not a number", function() {
        expect(helpful.isNumber("some value")).toEqual(false);
    });

    it("should be able to verify that undefined is not a number", function() {
        expect(helpful.isNumber(undefined)).toEqual(false);
    });

    it("should be able to verify that null is not a number", function() {
        expect(helpful.isNumber(null)).toEqual(false);
    });

    it("should be able to verify that numeric is a number", function() {
        expect(helpful.isNumber(123)).toEqual(true);
    });

    it("should be able to verify that null is not an array", function() {
        expect(helpful.isArray(null)).toEqual(false);
    });

    it("should be able to verify that undefined is not an array", function() {
        expect(helpful.isArray(undefined)).toEqual(false);
    });

    it("should be able to verify that String is not an array", function() {
        expect(helpful.isArray("")).toEqual(false);
    });

    it("should be an array", function() {
        expect(helpful.isArray([])).toEqual(true);
    });

    it("should have only numbers", function() {
        expect(helpful.hasOnlyNumbers([123, 456, 789])).toEqual(true);
    });

    it("Cannot have only numbers", function() {
        expect(helpful.hasOnlyNumbers([123, "abc", 789])).toEqual(false);
    });

    it("Should verify that is node webkit wrapper", function() {
        process = {};

        expect(helpful.isNodeWebkit()).toEqual(true);
    });

});
