describe("engine/Collision", function() {
    var el = document.createElement("div");
    el.id = 'stage';
    document.body.appendChild(el);

    var collision = new App.engine.Collision();

    it("should return same position when the target position is blocked", function() {
        var fromX = 5;
        var fromY = 5;
        var toX = 10;
        var toY = 10;
        var radius = 0.35;
        var miniMap = { mapHeight: 8, mapWidth: 8 };
        var screen = {};

        var newPosition = collision.checkCollision(fromX, fromY, toX, toY, radius, miniMap, screen);

        expect(newPosition.x).toEqual(fromX);
    });

});
