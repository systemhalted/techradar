function init(h: number, w: number): void {
  $('#title').text(document.title);  
       
  function normalizeKey(label: string): string {
    return (label || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  var ringIndexByName: { [key: string]: number } = {};
  for (var idx = 0; idx < radar_arcs.length; idx++) {
    ringIndexByName[normalizeKey(radar_arcs[idx].name)] = idx;
  }

  function ringIndexForItem(item: RadarItem): number {
    if (item.ring !== undefined) {
      var mapped = ringIndexByName[normalizeKey(item.ring)];
      if (mapped !== undefined) {
        return mapped;
      }
    }
    if (item.pc && item.pc.r !== undefined) {
      return Math.min(radar_arcs.length - 1, Math.floor(item.pc.r / 100));
    }
    return 0;
  }

  function hashSeed(seed: string | number): number {
    var hVal = 0;
    var str = (seed || '').toString();
    for (var i = 0; i < str.length; i++) {
      hVal = ((hVal << 5) - hVal) + str.charCodeAt(i);
      hVal |= 0;
    }
    return (hVal >>> 0) / 0xFFFFFFFF;
  }

  function radiusForRing(ringIndex: number, seed: string | number): number {
    var inner = ringIndex === 0 ? 0 : radar_arcs[ringIndex - 1].r;
    var outer = radar_arcs[ringIndex].r;
    var width = outer - inner;
    var jitter = (hashSeed(seed) - 0.5) * width * 0.6;
    var base = inner + width * 0.5;
    var rVal = base + jitter;
    var padding = 10;
    return Math.max(inner + padding, Math.min(rVal, outer - padding));
  }

  function angleRangeForQuadrant(name: string, index: number): AngleRange {
    var key = normalizeKey(name);
    if (key === 'techniques') { return { start: 90, end: 180 }; }
    if (key === 'tools') { return { start: 0, end: 90 }; }
    if (key === 'platforms') { return { start: 180, end: 270 }; }
    if (key === 'languagesframeworks' || key === 'languagesandframeworks' || key === 'languages') { return { start: 270, end: 360 }; }
    var start = (index % 4) * 90;
    return { start: start, end: start + 90 };
  }

  function legendPositionForQuadrant(range: AngleRange, index: number): { left: number; top: number } {
    var defaultLeft = 45;
    var defaultTop = 18;
    if (range.start === 0) { return { left: w - 200 + 30, top: defaultTop }; }
    if (range.start === 90) { return { left: defaultLeft, top: defaultTop }; }
    if (range.start === 180) { return { left: defaultLeft, top: h/2 + defaultTop }; }
    if (range.start === 270) { return { left: w - 200 + 30, top: h/2 + defaultTop }; }
    return { left: defaultLeft, top: defaultTop + (index * 80) };
  }

  function distributeAngles(range: AngleRange, count: number): number[] {
    var span = range.end - range.start;
    var step = span / (count + 1);
    var angles: number[] = [];
    for (var i = 0; i < count; i++) {
      angles.push(range.start + step * (i + 1));
    }
    return angles;
  }

  // Pre-compute missing coordinates based on quadrant and ring
  for (var q = 0; q < radar_data.length; q++) {
    var quadrant = radar_data[q];
    var range = angleRangeForQuadrant(quadrant.quadrant, q);
    if (quadrant.left === undefined || quadrant.top === undefined) {
      var legendPos = legendPositionForQuadrant(range, q);
      quadrant.left = legendPos.left;
      quadrant.top = legendPos.top;
    }

    for (var j = 0; j < quadrant.items.length; j++) {
      var item = quadrant.items[j];
      var ringIdx = ringIndexForItem(item);
      item.ringIndex = ringIdx;
      item.ringName = radar_arcs[ringIdx] && radar_arcs[ringIdx].name;
    }

    var itemsByRing = _.groupBy(quadrant.items, function(item: RadarItem) { return item.ringIndex; });
    for (var ringKey in itemsByRing) {
      if (!itemsByRing.hasOwnProperty(ringKey)) { continue; }
      var ringItems = itemsByRing[ringKey];
      var autoPlaceItems = _.filter(ringItems, function(item: RadarItem) { return !item.pc; });
      if (autoPlaceItems.length === 0) { continue; }

      var angles = distributeAngles(range, autoPlaceItems.length);
      for (var ai = 0; ai < autoPlaceItems.length; ai++) {
        var autoItem = autoPlaceItems[ai];
        autoItem.pc = { r: radiusForRing(parseInt(ringKey, 10), autoItem.name), t: angles[ai] };
      }
    }
  }
       
 var radar = new pv.Panel()
      .width(w)
      .height(h)
      .canvas('radar')

// arcs
radar.add(pv.Dot)
       .data(radar_arcs)
       .left(w/2)
       .bottom(h/2)
       .radius(function(d){return d.r;})
       .strokeStyle("#ccc")
       .anchor("top")       
       .add(pv.Label).text(function(d) { return d.name;});

//quadrant lines -- vertical
radar.add(pv.Line)
        .data([(h/2-radar_arcs[radar_arcs.length-1].r),h-(h/2-radar_arcs[radar_arcs.length-1].r)])
        .lineWidth(1)
        .left(w/2)        
        .bottom(function(d) {return d;})       
        .strokeStyle("#bbb");

//quadrant lines -- horizontal 
radar.add(pv.Line)
        .data([(w/2-radar_arcs[radar_arcs.length-1].r),w-(w/2-radar_arcs[radar_arcs.length-1].r)])
        .lineWidth(1)
        .bottom(h/2)
        .left(function(d) {return d;})       
        .strokeStyle("#bbb");


// blips
// var total_index=1;
// for (var i = 0; i < radar_data.length; i++) {
//     radar.add(pv.Dot)       
//     .def("active", false)
//     .data(radar_data[i].items)
//     .size( function(d) { return ( d.blipSize !== undefined ? d.blipSize : 70 ); })
//     .left(function(d) { var x = polar_to_raster(d.pc.r, d.pc.t)[0];
//                         //console.log("name:" + d.name + ", x:" + x); 
//                         return x;})
//     .bottom(function(d) { var y = polar_to_raster(d.pc.r, d.pc.t)[1];                                 
//                           //console.log("name:" + d.name + ", y:" + y); 
//                           return y;})
//     .title(function(d) { return d.name;})		 
//     .cursor( function(d) { return ( d.url !== undefined ? "pointer" : "auto" ); })                                                            
//     .event("click", function(d) { if ( d.url !== undefined ){self.location =  d.url}}) 
//     .angle(Math.PI)  // 180 degrees in radians !
//     .strokeStyle(radar_data[i].color)
//     .fillStyle(radar_data[i].color)
//     .shape(function(d) {return (d.movement === 't' ? "triangle" : "circle");})         
//     .anchor("center")
//         .add(pv.Label)
//         .text(function(d) {return total_index++;}) 
//         .textBaseline("middle")
//         .textStyle("white");            
// }


//Quadrant Ledgends
var radar_quadrant_ctr=1;
var quadrantFontSize = 18;
var headingFontSize = 14;
var stageHeadingCount = 0;
var lastRadius = 0;
var lastQuadrant='';
var spacer = 6;
var fontSize = 10;
var total_index = 1;

//TODO: Super fragile: re-order the items, by radius, in order to logically group by the rings.
for (var i = 0; i < radar_data.length; i++) {
    //adjust top by the number of headings.
    if (lastQuadrant != radar_data[i].quadrant) {
        radar.add(pv.Label)         
            .left( radar_data[i].left )         
            .top( radar_data[i].top )  
            .text(  radar_data[i].quadrant )		 
            .strokeStyle( radar_data[i].color )
            .fillStyle( radar_data[i].color )                    
            .font(quadrantFontSize + "px sans-serif");
         
        lastQuadrant = radar_data[i].quadrant;

    }

    var itemsByStage = _.groupBy(radar_data[i].items, function(item) {return item.ringIndex;});
    var offsetIndex = 0;
    for (var ringIndex = 0; ringIndex < radar_arcs.length; ringIndex++) {
        var stageItems = itemsByStage[ringIndex];
        if (!stageItems) { continue; }

        if (ringIndex > 0 && itemsByStage[ringIndex-1]) {
            offsetIndex = offsetIndex + itemsByStage[ringIndex-1].length + 1; 
            console.log("offsetIndex = " + itemsByStage[ringIndex-1].length, offsetIndex );
        }

        radar.add(pv.Label)         
            .left( radar_data[i].left + headingFontSize )
            .top( radar_data[i].top + quadrantFontSize + spacer + (ringIndex * headingFontSize) + (offsetIndex * fontSize) )
            .text( radar_arcs[ringIndex].name)
            .strokeStyle( '#cccccc' )
            .fillStyle( '#cccccc')                    
            .font(headingFontSize + "px Courier New");

    radar.add(pv.Label)             
        .left( radar_data[i].left )         
        .top( radar_data[i].top + quadrantFontSize + spacer + (ringIndex * headingFontSize) + (offsetIndex * fontSize) )
        .strokeStyle( radar_data[i].color )
        .fillStyle( radar_data[i].color )                    
        .add( pv.Dot )            
            .def("i", radar_data[i].top + quadrantFontSize + spacer + (ringIndex * headingFontSize) + spacer  + (offsetIndex * fontSize) )
            .data(stageItems)            
            .top( function() { return ( this.i() + (this.index * fontSize) );} )   
            .shape( function(d) {return (d.movement === 't' ? "triangle" : "circle");})                 
            .cursor( function(d) { return ( d.url !== undefined ? "pointer" : "auto" ); })                                                            
            .event("click", function(d) { if ( d.url !== undefined ){self.location =  d.url}}) 
            .size(fontSize) 
            .angle(45)            
            .anchor("right")                
                .add(pv.Label)                
                .text(function(d) {return radar_quadrant_ctr++ + ". " + d.name;} );

    radar.add(pv.Dot)       
      .def("active", false)
      .data(stageItems)
      .size( function(d) { return ( d.blipSize !== undefined ? d.blipSize : 70 ); })
      .left(function(d) { var x = polar_to_raster(d.pc.r, d.pc.t)[0];
                          //console.log("name:" + d.name + ", x:" + x); 
                          return x;})
      .bottom(function(d) { var y = polar_to_raster(d.pc.r, d.pc.t)[1];                                 
                            //console.log("name:" + d.name + ", y:" + y); 
                            return y;})
      .title(function(d) { return d.name;})		 
      .cursor( function(d) { return ( d.url !== undefined ? "pointer" : "auto" ); })                                                            
      .event("click", function(d) { if ( d.url !== undefined ){self.location =  d.url}}) 
      .angle(Math.PI)  // 180 degrees in radians !
      .strokeStyle(radar_data[i].color)
      .fillStyle(radar_data[i].color)
      .shape(function(d) {return (d.movement === 't' ? "triangle" : "circle");})         
      .anchor("center")
          .add(pv.Label)
          .text(function(d) {return total_index++;}) 
          .textBaseline("middle")
          .textStyle("white");            


    }
}      
       
 radar.anchor('radar');
 radar.render();
     
  };
