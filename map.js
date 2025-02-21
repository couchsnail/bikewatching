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

// map.on('load', () => { 
//     // Boston bike lane data
//     map.addSource('boston_route', {
//         type: 'geojson',
//         data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson?...'
//       });
    
//       map.addLayer({
//         id: 'bike-lanes',
//         type: 'line',
//         source: 'boston_route',
//         paint: {
//             'line-color': '#FF69B4',  
//             'line-width': 5,          
//             'line-opacity': 0.6       
//         }
//       });

//     // Cambridge Bike Lane data
//     map.addSource('cambridge_route', {
//     type: 'geojson',
//     data: 'RECREATION_BikeFacilities.geojson'
//     });

//     map.addLayer({
//     id: 'bike-lanes-cambridge',
//     type: 'line',
//     source: 'cambridge_route',
//     paint: {
//         'line-color': '#013220',  
//         'line-width': 5,          
//         'line-opacity': 0.6       
//     }
//     });

//     // Load the nested JSON file
//     const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json'
//     d3.json(jsonurl).then(jsonData => {
//         console.log('Loaded JSON Data:', jsonData);  
//         const stations = jsonData.data.stations;
//         console.log('Stations Array:', stations);
//     }).catch(error => {
//       console.error('Error loading JSON:', error);  // Handle errors if JSON loading fails
//     });

//     d3.json(jsonurl).then(jsonData => {
//         console.log('Loaded JSON Data:', jsonData);
        
//         // Extract stations
//         const stations = jsonData.data.stations;
//         console.log('Stations Array:', stations);

//         // Select SVG element (ensure there's an <svg> in your HTML)
//         const svg = d3.select('svg');

//         // Append circles for each station
//         circles = svg.selectAll('circle')
//             .data(stations)
//             .enter()
//             .append('circle')
//             .attr('r', 5)
//             .attr('fill', 'steelblue')
//             .attr('stroke', 'white')
//             .attr('stroke-width', 1)
//             .attr('opacity', 0.8);

//         // Initial positioning
//         updatePositions();
//     }).catch(error => {
//         console.error('Error loading JSON:', error);
//     });

//     //Resizing circles depending on traffic
//     const tripsUrl = 'https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv'
//     // d3.csv(tripsUrl).then(tripData => {
//     //     console.log('Loaded Traffic Data:', tripData);
//     //     trips = tripData;
    
//     //     // Calculate departures and arrivals
//     //     let departures = d3.rollup(
//     //         trips,
//     //         v => v.length,
//     //         d => d.start_station_id
//     //     );
    
//     //     let arrivals = d3.rollup(
//     //         trips,
//     //         v => v.length,
//     //         d => d.end_station_id
//     //     );
    
//     //     // Add traffic data to each station
//     //     stations = stations.map(station => {
//     //         let id = station.short_name;
//     //         station.arrivals = arrivals.get(id) ?? 0;
//     //         station.departures = departures.get(id) ?? 0; // Inserted here
//     //         station.totalTraffic = station.arrivals + station.departures; // Inserted here
//     //         return station;
//     //     });
    
//     //     // Update visualization after adding traffic data
//     //     circles = svg.selectAll('circle')
//     //         .data(stations)
//     //         .join('circle')
//     //         .attr('r', d => 5 + d.totalTraffic * 0.01) // Adjust radius based on traffic
//     //         .attr('fill', 'steelblue')
//     //         .attr('stroke', 'white')
//     //         .attr('stroke-width', 1)
//     //         .attr('opacity', 0.8);
    
//     //     updatePositions();
//     // }).catch(error => {
//     //     console.error('Error loading CSV:', error);
//     // });    

//     // Reposition markers on map interactions
//     map.on('move', updatePositions);
//     map.on('zoom', updatePositions);
//     map.on('resize', updatePositions);
//     map.on('moveend', updatePositions);
// });

// function getCoords(station) {
//     const point = new mapboxgl.LngLat(+station.lon, +station.lat);  // Convert lon/lat to Mapbox LngLat
//     const { x, y } = map.project(point);  // Project to pixel coordinates
//     return { cx: x, cy: y };  // Return as object for use in SVG attributes
//   }

// // Function to update circle positions when the map moves/zooms
// function updatePositions() {
//     circles
//       .attr('cx', d => getCoords(d).cx)  // Set the x-position using projected coordinates
//       .attr('cy', d => getCoords(d).cy); // Set the y-position using projected coordinates
//   }

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

    // Load the station data
    const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';
    d3.json(jsonurl).then(jsonData => {
        console.log('Loaded JSON Data:', jsonData);
        
        // Update the global stations array instead of re-declaring it
        stations = jsonData.data.stations;
        console.log('Stations Array:', stations);

        // Select SVG element
        circles = svg.selectAll('circle')
            .data(stations)
            .enter()
            .append('circle')
            .attr('r', 5)
            .attr('fill', 'steelblue')
            .attr('stroke', 'white')
            .attr('stroke-width', 1)
            .attr('opacity', 0.8);

        // Position circles initially
        updatePositions();
    }).catch(error => {
        console.error('Error loading JSON:', error);
    });

    // Load trip data to resize circles based on traffic
    const tripsUrl = 'https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv';
    d3.csv(tripsUrl).then(tripData => {
        console.log('Loaded Traffic Data:', tripData);
        trips = tripData;
    
        // Calculate departures and arrivals
        let departures = d3.rollup(trips, v => v.length, d => d.start_station_id);
        let arrivals = d3.rollup(trips, v => v.length, d => d.end_station_id);
    
        // Ensure stations array is updated with traffic data
        stations = stations.map(station => {
            let id = station.short_name;
            station.arrivals = arrivals.get(id) ?? 0;
            station.departures = departures.get(id) ?? 0;
            station.totalTraffic = station.arrivals + station.departures;
            return station;
        });

        const radiusScale = d3
            .scaleSqrt()
            .domain([0, d3.max(stations, (d) => d.totalTraffic)])
            .range([0, 25]);

        console.log("Updated Stations with Traffic Data:", stations);

        // Update visualization after adding traffic data
        circles = svg.selectAll('circle')
            .data(stations)
            .join('circle')
            .attr('r', d => radiusScale(d.totalTraffic)) // Use the scale for dynamic sizing
        
        // circles = circles.each(function(d) {
        //     // Add <title> for browser tooltips
        //     d3.select(this)
        //         .append('title')
        //         .text(`${d.totalTraffic} trips (${d.departures} departures, ${d.arrivals} arrivals)`);
        //     });

        updatePositions();
    }).catch(error => {
        console.error('Error loading CSV:', error);
    });

    // Reposition markers on map interactions
    map.on('move', updatePositions);
    map.on('zoom', updatePositions);
    map.on('resize', updatePositions);
    map.on('moveend', updatePositions);
});

// Function to get projected coordinates
function getCoords(station) {
    const point = new mapboxgl.LngLat(+station.lon, +station.lat);
    const { x, y } = map.project(point);
    return { cx: x, cy: y };
}

// Function to update circle positions when the map moves/zooms
function updatePositions() {
    circles.attr('cx', d => getCoords(d).cx)
           .attr('cy', d => getCoords(d).cy);
}