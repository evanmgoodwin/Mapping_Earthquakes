// Add console.log to check to see if our code is working
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create a base layer that holds both maps
let baseMaps = {
	"Streets": streets,
	"Satellite": satelliteStreets
};

// Create the earthquake layer for the map
let earthquakes = new L.layerGroup();

// Define an object that contains the overlays.
// This overlay will be visible all the time
let overlays = {
    Earthquakes: earthquakes
};

// Create the map object with center, zoom level and default layer
let map = L.map("mapid", {
	center: [39.5, -98.5],
	zoom: 3,
	layers: [streets]
});

// Add a control to the map that will allow the user to change which layers are visible
L.control.layers(baseMaps, overlays).addTo(map);

// Retrieve the earthquake GeoJSON data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
	// Creating a GeoJSON layer with the retrieved data
	L.geoJson(data, {
        // Turn each feature into a circleMarker on the map
        pointToLayer: function(feature, latlng) {
            console.log(data);
            return L.circleMarker(latlng);
        },
        // Set the style for each circleMarker using our styleInfo function
        style: styleInfo,
        // Create a popup for each circleMarker to display the magnitude
        // and location of the quake after the marker has been created and styled
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(earthquakes);

    // Add the earthquake layer to the map
    earthquakes.addTo(map);
});

        
        
// This functiion returns the style data for each of the quakes er plot on
// the map. We pass the magnitude of the quake into a function
// to calculate the radius.
function styleInfo(feature) {
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };
};

// This function determines the color of the circle based on the magnitude of the quake
function getColor(magnitude) {
    if (magnitude > 5) {
        return "#EA2C2C";
    }
    if (magnitude > 4) {
        return "#EA822C";
    }
    if (magnitude > 3) {
        return "#EE9C00";
    }
    if (magnitude > 2) {
        return "#EECC00";
    }
    if (magnitude > 1) {
        return "#D4EE00";
    }
    return "#98EE00";
};
        
// This function determines the radius of the quake marker based on its magnitude.
// Quakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
};