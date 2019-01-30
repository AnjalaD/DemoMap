
// // Initialize the platform object:
// var platform = new H.service.Platform({
//     'app_id': '{xRymLb0c3HeaIpvkn873}',
//     'app_code': '{nMKNammAMpBXJx4l3p9tgw}'
// });

// // Obtain the default map types from the platform object
// var maptypes = platform.createDefaultLayers();

// // Instantiate (and display) a map object:
// var map = new H.Map(
// document.getElementById('mapContainer'),
// maptypes.normal.map,
// {
//   zoom: 10,
//   center: { lng: 13.4, lat: 52.51 }
// });

/**
 * Moves the map to display over Berlin
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function moveMapToBerlin(map){
  map.setCenter({lat:52.5159, lng:13.3777});
  map.setZoom(14);
}

function setMapViewBounds(map){
  var bbox = new H.geo.Rect(42.3736,-71.0751,42.3472,-71.0408);
  map.setViewBounds(bbox);
}





/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  'app_id': '{xRymLb0c3HeaIpvkn873}',
  'app_code': '{nMKNammAMpBXJx4l3p9tgw}',
  useHTTPS: true
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});

//Step 2: initialize a map  - not specificing a location will give a whole world view.
var map = new H.Map(document.getElementById('mapContainer'),
  defaultLayers.normal.map, {pixelRatio: pixelRatio});

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Now use the map as required...
// moveMapToBerlin(map);
setMapViewBounds(map);