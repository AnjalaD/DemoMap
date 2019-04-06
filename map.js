class HMap {

    static instance = null;

    constructor() {
        //initialize communication with the platform
        this.platform = new H.service.Platform({
            'app_id': 'xRymLb0c3HeaIpvkn873',
            'app_code': 'nMKNammAMpBXJx4l3p9tgw',
            useHTTPS: true
        });
        this.pixelRatio = window.devicePixelRatio || 1;
        this.defaultLayers = this.platform.createDefaultLayers({
            tileSize: this.pixelRatio === 1 ? 256 : 512,
            ppi: this.pixelRatio === 1 ? undefined : 320
        });
    }

    static getInstance() {
        if (HMap.instance == null) {
            HMap.instance = new HMap();
        }
        return HMap.instance;
    }

    addMarkerToGroup(group, latitude, longitude, html = 'default marker') {
        var marker = new H.map.Marker({ lat: latitude, lng: longitude });
        marker.setData(html);
        group.addObject(marker);
    }

    setViewBubblesToGroup(group,ui) {

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

    //position should be a json object with latitude and longitude as attributes
    showPointAndCenter(position, mapContainerId, label) {

        //initialize a map  - not specificing a location will give a whole world view.
        var map = new H.Map(document.getElementById(mapContainerId), this.defaultLayers.normal.map, { pixelRatio: this.pixelRatio });

        // MapEvents enables the event system
        // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
        var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

        // Create the default UI components
        var ui = H.ui.UI.createDefault(map, this.defaultLayers);

        //create a group
        var group = new H.map.Group();
        map.addObject(group);

        //add marker to group
        this.addMarkerToGroup(group, position.latitude, position.longitude, label);
        
        //set bubbles
        this.setViewBubblesToGroup(group,ui);

        //center to the marker
        map.setCenter({ lat: position.latitude, lng: position.longitude });
        map.setZoom(17);

    }

    showRouteFromAtoB(positionA,positionB,mapContainerId){
        
    }
}

