describe("core/package/Manager", function() {
    var el = document.createElement("div");
    el.id = 'stage';
    document.body.appendChild(el);

    it("should define a new Prototype", function() {
        App.define("Test", "some/pack", (function(fn) {
            return fn;
        }));

        expect(new App.some.pack.Test()).toBeDefined();
    });

});
