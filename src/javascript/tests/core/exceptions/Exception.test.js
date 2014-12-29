describe("Exception", function() {
    var el = document.createElement("div");
    el.id = 'stage';
    document.body.appendChild(el);

    var exception = App.Exception;

    it("should log some message", function() {
        spyOn(console, 'error');

        exception.throw("Some message");

        expect(console.error).toHaveBeenCalled();
    });


    it("should log some message and exception cause", function() {
        var exceptionStack = null;

        try {
            throw "Some stack-trace"
        } catch(e) {
            exceptionStack = e;
        }

        spyOn(console, 'error');

        exception.throw("Some message", exceptionStack);

        expect(console.error).toHaveBeenCalled();
    });

});
