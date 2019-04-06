
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

//centers the map t a specific point
function moveMapToSpecific(map,latitude,longitude){
  map.setCenter({lat:latitude, lng:longitude});
  map.setZoom(17);
}

//adds a normal blue marker to a group which belongs to a map
function addMarkerToGroup(group,latitude,longitude,html='default marker'){
  var marker = new H.map.Marker({lat:latitude,lng:longitude});
  marker.setData(html);
  group.addObject(marker);
}

function addDOMMarkerToGroup(group,latitude,longitude){
  var svgMarkup = '<svg width="24" height="24" ' +
  'xmlns="http://www.w3.org/2000/svg">' +
  '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
  'height="22" /><text x="12" y="18" font-size="12pt" ' +
  'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
  'fill="white">H</text></svg>';

  var iconPath = 'burger.png';

  var icon = new H.map.Icon(iconPath);
  var coords = {lat:latitude, lng:longitude};
  var marker = new H.map.Marker(coords,{icon:icon});
  group.addObject(marker);
}

function showCurrentLocation(map){
  if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(function(position){
      console.log(position);
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      var locationIcon = new H.map.Icon('user_location_icon.png');
      var coords = { lat: latitude, lng: longitude };
      var marker = new H.map.Marker(coords, { icon: locationIcon });
      console.log(map);
      map.addObject(marker);
    });
    
  } 

}

function extractCoordinates(position){
  console.log(position);
  return [position.coords.latitude,position.coords.longitude];
}

//seats the bounds of the map
function setMapViewBounds(map,lat1,lat2,lng1,lng2){
  var bbox = new H.geo.Rect(lat1,lng1,lat2,lng2);
  map.setViewBounds(bbox);
}

function setViewBubblesToGroup(group){


  // add 'tap' event listener, that opens info bubble, to the group
  group.addEventListener('tap', function (evt) {
    // event target is the marker itself, group is a parent event target
    // for all objects that it contains
    var bubble = new H.ui.InfoBubble(evt.target.getPosition(), {
      // read custom data
      content: evt.target.getData()
    });
    // show info bubble
    ui.addBubble(bubble);
  }, false);


}




/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  'app_id': 'xRymLb0c3HeaIpvkn873',
  'app_code': 'nMKNammAMpBXJx4l3p9tgw',
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
var routeInstructionsContainer = document.getElementById('panel');


//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Now use the map as required...
group = new H.map.Group();
map.addObject(group);

addMarkerToGroup(group,6.7949240,79.900755,'university');
addMarkerToGroup(group,6.7745335,79.8825144,'moratuwa');
addMarkerToGroup(group,6.7973805,79.8885460);
addDOMMarkerToGroup(group,6.786879, 79.884623);
// moveMapToSpecific(map,6.7949240,79.900755);
setMapViewBounds(map,6.7999,6.76,79.87,79.91);
showCurrentLocation(map);
setViewBubblesToGroup(group);

//bubble for each point in directions
var bubble;












/**
 * Calculates and displays a car route from the Brandenburg Gate in the centre of Berlin
 * to Friedrichstraße Railway Station.
 *
 * A full list of available request parameters can be found in the Routing API documentation.
 * see:  http://developer.here.com/rest-apis/documentation/routing/topics/resource-calculate-route.html
 *
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */
function calculateRouteFromAtoB (platform,positionA,positionB) {
  var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: 'fastest;car',
      representation: 'display',
      routeattributes : 'waypoints,summary,shape,legs',
      maneuverattributes: 'direction,action',
      waypoint0: positionA.join(","), // university
      waypoint1: positionB.join(",")  // moratuwa
    };


  router.calculateRoute(
    routeRequestParams,
    onSuccess,
    onError
  );
}
/**
 * This function will be called once the Routing REST API provides a response
 * @param  {Object} result          A JSONP object representing the calculated route
 *
 * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
 */
function onSuccess(result) {
  console.log(result);
  var route = result.response.route[0];
 /*
  * The styling of the route response on the map is entirely under the developer's control.
  * A representitive styling can be found the full JS + HTML code of this example
  * in the functions below:
  */
  addRouteShapeToMap(route);
  addManueversToMap(route);

  addWaypointsToPanel(route.waypoint);
  addManueversToPanel(route);
  addSummaryToPanel(route.summary);
  // ... etc.
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  alert('Ooops!');
}




/**
 * Boilerplate map initialization code starts below:
 */

// // set up containers for the map  + panel
// var mapContainer = document.getElementById('mapContainer'),
//   routeInstructionsContainer = document.getElementById('panel');

// //Step 1: initialize communication with the platform
// var platform = new H.service.Platform({
//   app_id: 'devportal-demo-20180625',
//   app_code: '9v2BkviRwi9Ot26kp2IysQ',
//   useHTTPS: true
// });
// var pixelRatio = window.devicePixelRatio || 1;
// var defaultLayers = platform.createDefaultLayers({
//   tileSize: pixelRatio === 1 ? 256 : 512,
//   ppi: pixelRatio === 1 ? undefined : 320
// });

// //Step 2: initialize a map - this map is centered over Berlin
// var map = new H.Map(mapContainer,
//   defaultLayers.normal.map,{
//   center: {lat:52.5160, lng:13.3779},
//   zoom: 13,
//   pixelRatio: pixelRatio
// });

// //Step 3: make the map interactive
// // MapEvents enables the event system
// // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
// var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// // Create the default UI components
// var ui = H.ui.UI.createDefault(map, defaultLayers);



/**
 * Opens/Closes a infobubble
 * @param  {H.geo.Point} position     The location on the map.
 * @param  {String} text              The contents of the infobubble.
 */
function openBubble(position, text){
 if(!bubble){
    bubble =  new H.ui.InfoBubble(
      position,
      // The FO property holds the province name.
      {content: text});
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}


/**
 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addRouteShapeToMap(route){
  var lineString = new H.geo.LineString(),
    routeShape = route.shape,
    polyline;

  routeShape.forEach(function(point) {
    var parts = point.split(',');
    lineString.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(lineString, {
    style: {
      lineWidth: 4,
      strokeColor: 'rgba(0, 128, 255, 0.7)'
    }
  });
  // Add the polyline to the map
  map.addObject(polyline);
  // And zoom to its bounding rectangle
  map.setViewBounds(polyline.getBounds(), true);
}


/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addManueversToMap(route){
  var svgMarkup = '<svg width="18" height="18" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="8" cy="8" r="8" ' +
      'fill="#1b468d" stroke="white" stroke-width="1"  />' +
    '</svg>',
    dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
    group = new  H.map.Group(),
    i,
    j;

  // Add a marker for each maneuver
  for (i = 0;  i < route.leg.length; i += 1) {
    for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
      // Get the next maneuver.
      maneuver = route.leg[i].maneuver[j];
      // Add a marker to the maneuvers group
      var marker =  new H.map.Marker({
        lat: maneuver.position.latitude,
        lng: maneuver.position.longitude} ,
        {icon: dotIcon});
      marker.instruction = maneuver.instruction;
      group.addObject(marker);
    }
  }

  group.addEventListener('tap', function (evt) {
    map.setCenter(evt.target.getPosition());
    openBubble(
       evt.target.getPosition(), evt.target.instruction);
  }, false);

  // Add the maneuvers group to the map
  map.addObject(group);
}


/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addWaypointsToPanel(waypoints){



  var nodeH3 = document.createElement('h3'),
    waypointLabels = [],
    i;


   for (i = 0;  i < waypoints.length; i += 1) {
    waypointLabels.push(waypoints[i].label)
   }

   nodeH3.textContent = waypointLabels.join(' - ');
   console.log(routeInstructionsContainer);

  routeInstructionsContainer.innerHTML = '';
  routeInstructionsContainer.appendChild(nodeH3);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addSummaryToPanel(summary){
  var summaryDiv = document.createElement('div'),
   content = '';
   content += '<b>Total distance</b>: ' + summary.distance  + 'm. <br/>';
   content += '<b>Travel Time</b>: ' + summary.travelTime.toMMSS() + ' (in current traffic)';


  summaryDiv.style.fontSize = 'small';
  summaryDiv.style.marginLeft ='5%';
  summaryDiv.style.marginRight ='5%';
  summaryDiv.innerHTML = content;
  routeInstructionsContainer.appendChild(summaryDiv);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addManueversToPanel(route){



  var nodeOL = document.createElement('ol'),
    i,
    j;

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft ='5%';
  nodeOL.style.marginRight ='5%';
  nodeOL.className = 'directions';

     // Add a marker for each maneuver
  for (i = 0;  i < route.leg.length; i += 1) {
    for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
      // Get the next maneuver.
      maneuver = route.leg[i].maneuver[j];

      var li = document.createElement('li'),
        spanArrow = document.createElement('span'),
        spanInstruction = document.createElement('span');

      spanArrow.className = 'arrow '  + maneuver.action;
      spanInstruction.innerHTML = maneuver.instruction;
      li.appendChild(spanArrow);
      li.appendChild(spanInstruction);

      nodeOL.appendChild(li);
    }
  }

  routeInstructionsContainer.appendChild(nodeOL);
}


Number.prototype.toMMSS = function () {
  return  Math.floor(this / 60)  +' minutes '+ (this % 60)  + ' seconds.';
}

// Now use the map as required...
// calculateRouteFromAtoB (platform,[6.7949240,79.900755],[6.7745335,79.8825144]); //from university to moratuwa
// calculateRouteFromAtoB (platform,[6.7949240,79.900755],[7.028276, 79.922713]); //from university to ragama
calculateRouteFromAtoB (platform,[6.7949240,79.900755],[7.485723, 80.364204]); //from university to kurunegala

