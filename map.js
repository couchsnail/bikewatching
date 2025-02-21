// Set your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1IjoiY2lzaWNhdCIsImEiOiJjbTdkem5zZWUwOXhmMmxwdmg3dWpzNDYxIn0.41T-Lrb-_ei_l8OA1qaxrw';

const svg = d3.select('#map').select('svg');
let stations = [];
let circles;
let trips = [];

// Initialize the map
const map = new mapboxgl.Map({
    container: 'map', // ID of the div where the map will render
    style: 'mapbox://styles/mapbox/streets-v12', // Map style
    center: [-71.09415, 42.36027], // [longitude, latitude]
    zoom: 12, // Initial zoom level
    minZoom: 5, // Minimum allowed zoom
    maxZoom: 18 // Maximum allowed zoom
});

map.on('load', () => { 
    // Boston bike lane data
    map.addSource('boston_route', {
        type: 'geojson',
        data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson?...'
      });
    
      map.addLayer({
        id: 'bike-lanes',
        type: 'line',
        source: 'boston_route',
        paint: {
            'line-color': '#FF69B4',  
            'line-width': 5,          
            'line-opacity': 0.6       
        }
      });

    // Cambridge Bike Lane data
    map.addSource('cambridge_route', {
    type: 'geojson',
    data: 'RECREATION_BikeFacilities.geojson'
    });

    map.addLayer({
    id: 'bike-lanes-cambridge',
    type: 'line',
    source: 'cambridge_route',
    paint: {
        'line-color': '#013220',  
        'line-width': 5,          
        'line-opacity': 0.6       
    }
    });

    // Load the nested JSON file
    const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json'
    d3.json(jsonurl).then(jsonData => {
        console.log('Loaded JSON Data:', jsonData);  
        const stations = jsonData.data.stations;
        console.log('Stations Array:', stations);
    }).catch(error => {
      console.error('Error loading JSON:', error);  // Handle errors if JSON loading fails
    });

    d3.json(jsonurl).then(jsonData => {
        console.log('Loaded JSON Data:', jsonData);
        
        // Extract stations
        const stations = jsonData.data.stations;
        console.log('Stations Array:', stations);

        // Select SVG element (ensure there's an <svg> in your HTML)
        const svg = d3.select('svg');

        // Append circles for each station
        circles = svg.selectAll('circle')
            .data(stations)
            .enter()
            .append('circle')
            .attr('r', 5)
            .attr('fill', 'steelblue')
            .attr('stroke', 'white')
            .attr('stroke-width', 1)
            .attr('opacity', 0.8);

        // Initial positioning
        updatePositions();
    }).catch(error => {
        console.error('Error loading JSON:', error);
    });

    //Resizing circles depending on traffic
    const tripsUrl = 'https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv'

    // Reposition markers on map interactions
    map.on('move', updatePositions);
    map.on('zoom', updatePositions);
    map.on('resize', updatePositions);
    map.on('moveend', updatePositions);
});

function getCoords(station) {
    const point = new mapboxgl.LngLat(+station.lon, +station.lat);  // Convert lon/lat to Mapbox LngLat
    const { x, y } = map.project(point);  // Project to pixel coordinates
    return { cx: x, cy: y };  // Return as object for use in SVG attributes
  }

// Function to update circle positions when the map moves/zooms
function updatePositions() {
    circles
      .attr('cx', d => getCoords(d).cx)  // Set the x-position using projected coordinates
      .attr('cy', d => getCoords(d).cy); // Set the y-position using projected coordinates
  }


