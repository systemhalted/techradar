function polar_to_cartesian(r: number, t: number): [number, number] {  
  // radians to degrees, requires the t*pi/180
  var x = r * Math.cos((t*Math.PI/180));
  var y = r * Math.sin((t*Math.PI/180));
  return [x,y];
}

function cartesian_to_raster(x: number, y: number): [number, number] {
  var rx = w/2 + x;
  var ry = h/2 + y;
  return [rx,ry];
}

function raster_to_cartesian(rx: number, ry: number): [number, number] {
  var x = rx - w/2;
  var y = ry - h/2;
  return [x,y];
}

function polar_to_raster(r: number, t: number): [number, number] {
  var xy = polar_to_cartesian(r,t);
  return cartesian_to_raster(xy[0], xy[1]);
}
