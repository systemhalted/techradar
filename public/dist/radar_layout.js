function normalizeKey(label) {
    return (label || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}
function buildRingIndexMap(arcs) {
    var ringIndexByName = {};
    for (var idx = 0; idx < arcs.length; idx++) {
        ringIndexByName[normalizeKey(arcs[idx].name)] = idx;
    }
    return ringIndexByName;
}
function ringIndexForItem(item, arcs, ringIndexByName) {
    if (item.ring !== undefined) {
        var mapped = ringIndexByName[normalizeKey(item.ring)];
        if (mapped !== undefined) {
            return mapped;
        }
    }
    if (item.pc && item.pc.r !== undefined) {
        return Math.min(arcs.length - 1, Math.floor(item.pc.r / 100));
    }
    return 0;
}
function hashSeed(seed) {
    var hVal = 0;
    var str = (seed || '').toString();
    for (var i = 0; i < str.length; i++) {
        hVal = ((hVal << 5) - hVal) + str.charCodeAt(i);
        hVal |= 0;
    }
    return (hVal >>> 0) / 0xFFFFFFFF;
}
function radiusForRing(arcs, ringIndex, seed) {
    var inner = ringIndex === 0 ? 0 : arcs[ringIndex - 1].r;
    var outer = arcs[ringIndex].r;
    var width = outer - inner;
    var jitter = (hashSeed(seed) - 0.5) * width * 0.6;
    var base = inner + width * 0.5;
    var rVal = base + jitter;
    var padding = 10;
    return Math.max(inner + padding, Math.min(rVal, outer - padding));
}
function angleRangeForQuadrant(name, index) {
    var key = normalizeKey(name);
    if (key === 'techniques') {
        return { start: 90, end: 180 };
    }
    if (key === 'tools') {
        return { start: 0, end: 90 };
    }
    if (key === 'platforms') {
        return { start: 180, end: 270 };
    }
    if (key === 'languagesframeworks' || key === 'languagesandframeworks' || key === 'languages') {
        return { start: 270, end: 360 };
    }
    var start = (index % 4) * 90;
    return { start: start, end: start + 90 };
}
function distributeAngles(range, count) {
    var span = range.end - range.start;
    var step = span / (count + 1);
    var angles = [];
    for (var i = 0; i < count; i++) {
        angles.push(range.start + step * (i + 1));
    }
    return angles;
}
