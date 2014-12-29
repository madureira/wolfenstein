describe("core/config/Shortcut", function() {
    var el = document.createElement("div");
    el.id = 'stage';
    document.body.appendChild(el);

    var shortcut = new App.core.config.Shortcut();

    it("should add a new shortcut", function() {
        shortcut.addShortcut("some", {
            Test: function() {
                return true;
            }
        });

        expect(App.some.Test()).toBe(true);
    });

});
