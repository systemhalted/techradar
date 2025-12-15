describe("radar_layout helpers", function () {
    var arcs = [
        { r: 100, name: "Adopt" },
        { r: 200, name: "Trial" },
        { r: 300, name: "Assess" },
        { r: 400, name: "Hold" }
    ];
    it("builds ring index map", function () {
        var map = buildRingIndexMap(arcs);
        expect(map["adopt"]).toEqual(0);
        expect(map["trial"]).toEqual(1);
        expect(map["assess"]).toEqual(2);
        expect(map["hold"]).toEqual(3);
    });
    it("resolves ring index from ring name or pc.r fallback", function () {
        var map = buildRingIndexMap(arcs);
        var itemByName = { name: "X", ring: "Assess" };
        var itemByPc = { name: "Y", pc: { r: 250, t: 10 } };
        var itemDefault = { name: "Z" };
        expect(ringIndexForItem(itemByName, arcs, map)).toEqual(2);
        expect(ringIndexForItem(itemByPc, arcs, map)).toEqual(2);
        expect(ringIndexForItem(itemDefault, arcs, map)).toEqual(0);
    });
    it("computes angle ranges per quadrant", function () {
        expect(angleRangeForQuadrant("Techniques", 0)).toEqual({ start: 90, end: 180 });
        expect(angleRangeForQuadrant("Tools", 1)).toEqual({ start: 0, end: 90 });
        expect(angleRangeForQuadrant("Platforms", 2)).toEqual({ start: 180, end: 270 });
        expect(angleRangeForQuadrant("Languages & Frameworks", 3)).toEqual({ start: 270, end: 360 });
        // Fallback for unknown quadrant
        expect(angleRangeForQuadrant("Custom", 1)).toEqual({ start: 90, end: 180 });
    });
    it("distributes angles evenly within a range", function () {
        var angles = distributeAngles({ start: 0, end: 90 }, 3);
        // 4 segments; expect at 22.5, 45, 67.5
        expect(angles.length).toEqual(3);
        expect(Math.round(angles[0] * 10) / 10).toEqual(22.5);
        expect(Math.round(angles[1] * 10) / 10).toEqual(45);
        expect(Math.round(angles[2] * 10) / 10).toEqual(67.5);
    });
    it("keeps radius jitter within ring bounds", function () {
        var r = radiusForRing(arcs, 2, "seed");
        expect(r).toBeGreaterThan(arcs[1].r + 5);
        expect(r).toBeLessThan(arcs[2].r - 5);
        // Different seed yields different position
        var r2 = radiusForRing(arcs, 2, "seed2");
        expect(r).not.toEqual(r2);
    });
});
