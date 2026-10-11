let options = {
    enableHighAccuracy: true,
    timeout: 45000
};

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
} else {
    alert('Your browser does not natively support geolocation.');
}

function svgIcon(color) {
    return L.divIcon({
        className: 'poi-icon',
        html: `
            <svg width="25" height="32" viewBox="0 0 25 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 0C5.6 0 0 5.6 0 12.5 0 21.5 12.5 32 12.5 32S25 21.5 25 12.5C25 5.6 19.4 0 12.5 0z"
                    fill="${color}" stroke="#1c2b24" stroke-width="1"/>
                <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
            </svg>`,
        iconSize:    [25, 32],  // match SVG's width/height
        iconAnchor:  [12, 32],  // the pinpoint — where the actual coordinate is at
        popupAnchor: [0, -28]   // where a popup opens relative to iconAnchor
    });
}

function successCallback(position) {
    let msg = `
        Longitude: ${position.coords.longitude.toFixed(7)}&deg;<br/>
        Latitude: ${position.coords.latitude.toFixed(7)}&deg;<br/>
        Accuracy: ${position.coords.accuracy.toFixed(2)} meters<br/>
        Time: ${new Date(position.timestamp).toLocaleString()}<br/>` // watch out spelling of locale

    if (position.coords.altitude)
        msg += `Altitude: ${position.coords.altitude.toFixed(2)} meters<br/>`
    if (position.coords.altitudeAccuracy)
    	msg += `Altitude Accuracy: ${position.coords.altitudeAccuracy} meters<br/>`
    if (position.coords.heading)
    	msg += `Heading: ${position.coords.heading}&deg;<br/>`
    if (position.coords.speed) {
    	msg += `Speed: ${position.coords.speed} m/s`;
    }
    
    let lat = position.coords.latitude.toFixed(7);
    let lon = position.coords.longitude.toFixed(7);
    
    const map = L.map('map', { 
        center: [lat, lon], 
        zoom: 17
    });

    const streets = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, 
        attribution: 'Tiles &copy; Esri'
    }).addTo(map);   // on by default

    const topo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, 
        attribution: 'Tiles &copy; Esri'
    });

    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, 
        attribution: 'Tiles &copy; Esri'
    });

    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    const my_loc = [
        {name: "My Location", coords: [lat, lon], note: msg}
    ]

    const LOC_COLOR = '#a6531c';

    const locLayer = L.layerGroup(
    my_loc.map(f => L.marker(f.coords, { icon: svgIcon(LOC_COLOR) })
        .bindPopup(`<strong>${f.name}</strong><br/>${f.note}`)))
        .addTo(map);
}

function errorCallback(error) {
    const msgs = { 
        [error.PERMISSION_DENIED]: 'Permission denied',
        [error.POSITION_UNAVAILABLE]: 'Position unavailable',
        [error.TIMEOUT]: 'Request timeout',
        [error.UNKNOWN_ERROR]: 'Unknown error'
    };
    let msg = `Error: ${msgs[error.code]}`;

    const map = L.map('map', { 
        center: [0, 0], 
        zoom: 5
    });

    const streets = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, 
        attribution: 'Tiles &copy; Esri'
    }).addTo(map);   // on by default

    const topo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, 
        attribution: 'Tiles &copy; Esri'
    });

    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, 
        attribution: 'Tiles &copy; Esri'
    });

    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    const my_loc = [
        {name: "Location Error", coords: [0, 0], note: msg}
    ]

    const LOC_COLOR = '#a6531c';

    const locLayer = L.layerGroup(
    my_loc.map(f => L.marker(f.coords, { icon: svgIcon(LOC_COLOR) })
        .bindPopup(`<strong>${f.name}</strong><br/>${f.note}`)))
        .addTo(map);
}