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

// map.on('load', async () => { 
//     // Boston bike lane data
//     map.addSource('boston_route', {
//         type: 'geojson',
//         data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson'
//     });

//     map.addLayer({
//         id: 'bike-lanes',
//         type: 'line',
//         source: 'boston_route',
//         paint: {
//             'line-color': '#FF69B4',  
//             'line-width': 5,          
//             'line-opacity': 0.6       
//         }
//     });

//     // Cambridge Bike Lane data (Ensure correct URL)
//     map.addSource('cambridge_route', {
//         type: 'geojson',
//         data: 'RECREATION_BikeFacilities.geojson'
//     });

//     map.addLayer({
//         id: 'bike-lanes-cambridge',
//         type: 'line',
//         source: 'cambridge_route',
//         paint: {
//             'line-color': '#013220',  
//             'line-width': 5,          
//             'line-opacity': 0.6       
//         }
//     });

//     try {
//         // Load station data
//         const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';
//         let jsonData = await d3.json(jsonurl);
//         console.log('Loaded JSON Data:', jsonData);

//         let stations = jsonData.data.stations;

//         // Select SVG and bind data
//         let circles = svg.selectAll('circle')
//             .data(stations)
//             .enter()
//             .append('circle')
//             .attr('r', 5)
//             .attr('fill', 'steelblue')
//             .attr('stroke', 'white')
//             .attr('stroke-width', 1)
//             .attr('opacity', 0.8);

//         updatePositions();

//         // Load trip data using async/await
//         let trips = await d3.csv(
//             'https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv',
//             (trip) => {
//                 trip.started_at = new Date(trip.started_at);
//                 trip.ended_at = new Date(trip.ended_at);
//                 return trip;
//             }
//         );

//         console.log('Loaded Traffic Data:', trips);

//         let updatedStations = computeStationTraffic(stations, trips);

//         const radiusScale = d3.scaleSqrt()
//             .domain([0, d3.max(updatedStations, d => d.totalTraffic)])
//             .range([0, 25]);

//         circles = svg.selectAll('circle')
//             .data(stations, (d) => d.short_name)
//             .join('circle')
//             .attr('r', d => radiusScale(d.totalTraffic))
//             .attr('cx', d => getCoords(d).cx)
//             .attr('cy', d => getCoords(d).cy)
//             .append('title')
//             .text(d => `${d.totalTraffic} trips (${d.departures} departures, ${d.arrivals} arrivals)`);

//     } catch (error) {
//         console.error('Error loading data:', error);
//     }

//     function updateTimeDisplay() {
//         let timeFilter = Number(timeSlider.value); // Get slider value
    
//         if (timeFilter === -1) {
//           selectedTime.textContent = ''; // Clear time display
//           anyTimeLabel.style.display = 'block'; // Show "(any time)"
//         } else {
//           selectedTime.textContent = formatTime(timeFilter); // Display formatted time
//           anyTimeLabel.style.display = 'none'; // Hide "(any time)"
//         }
        
//         // Call updateScatterPlot to reflect the changes on the map
//         updateScatterPlot(timeFilter);
//     }

//     function updateScatterPlot(timeFilter) {
//         // Get only the trips that match the selected time filter
//         const filteredTrips = filterTripsbyTime(trips, timeFilter);
        
//         // Recompute station traffic based on the filtered trips
//         const filteredStations = computeStationTraffic(stations, filteredTrips);
        
//         // Update the scatterplot by adjusting the radius of circles
//         circles
//           .data(filteredStations)
//           .join('circle') // Ensure the data is bound correctly
//           .attr('r', (d) => radiusScale(d.totalTraffic)); // Update circle sizes
//     }

//     // Reposition markers when the map moves
//     map.on('move', updatePositions);
//     map.on('zoom', updatePositions);
//     map.on('resize', updatePositions);
//     map.on('moveend', updatePositions);
// });


// // Function to get projected coordinates
// function getCoords(station) {
//     const point = new mapboxgl.LngLat(+station.lon, +station.lat);
//     const { x, y } = map.project(point);
//     return { cx: x, cy: y };
// }

// // Function to update circle positions
// function updatePositions() {
//     svg.selectAll('circle')
//        .attr('cx', d => getCoords(d).cx)
//        .attr('cy', d => getCoords(d).cy);
// }

// // Tooltip setup
// const tooltip = d3.select('body').append('div')
//     .attr('class', 'tooltip')
//     .style('position', 'absolute')
//     .style('visibility', 'hidden')
//     .style('background', 'white')
//     .style('border', '1px solid black')
//     .style('border-radius', '5px')
//     .style('padding', '5px')
//     .style('z-index', '1000');

// // Time slider fix
// const timeSlider = document.getElementById('time-slider');
// const selectedTime = document.getElementById('selected-time');
// const anyTimeLabel = document.getElementById('any-time');

// function formatTime(minutes) {
//     const date = new Date(0, 0, 0, 0, minutes);
//     return date.toLocaleString('en-US', { timeStyle: 'short' });
// }

// timeSlider.addEventListener('input', updateTimeDisplay);
// updateTimeDisplay();

// // Function to compute traffic data
// function computeStationTraffic(stations, trips) {
//     const departures = d3.rollup(trips, v => v.length, d => d.start_station_id);
//     const arrivals = d3.rollup(trips, v => v.length, d => d.end_station_id);

//     return stations.map(station => {
//         let id = station.short_name;
//         return {
//             ...station,
//             arrivals: arrivals.get(id) ?? 0,
//             departures: departures.get(id) ?? 0,
//             totalTraffic: (arrivals.get(id) ?? 0) + (departures.get(id) ?? 0)
//         };
//     });
// }

// function minutesSinceMidnight(date) {
//     return date.getHours() * 60 + date.getMinutes();
//   }

//   function filterTripsbyTime(trips, timeFilter) {
//     return timeFilter === -1 
//       ? trips // If no filter is applied (-1), return all trips
//       : trips.filter((trip) => {
//           // Convert trip start and end times to minutes since midnight
//           const startedMinutes = minutesSinceMidnight(trip.started_at);
//           const endedMinutes = minutesSinceMidnight(trip.ended_at);
          
//           // Include trips that started or ended within 60 minutes of the selected time
//           return (
//             Math.abs(startedMinutes - timeFilter) <= 60 ||
//             Math.abs(endedMinutes - timeFilter) <= 60
//           );
//       });
//   }
// map.on('load', () => {
//     // Boston bike lane data
//     map.addSource('boston_route', {
//         type: 'geojson',
//         data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson?...'
//     });

//     map.addLayer({
//         id: 'bike-lanes',
//         type: 'line',
//         source: 'boston_route',
//         paint: {
//             'line-color': '#FF69B4',  
//             'line-width': 5,          
//             'line-opacity': 0.6       
//         }
//     });

//     // Cambridge Bike Lane data
//     map.addSource('cambridge_route', {
//         type: 'geojson',
//         data: 'RECREATION_BikeFacilities.geojson'
//     });

//     map.addLayer({
//         id: 'bike-lanes-cambridge',
//         type: 'line',
//         source: 'cambridge_route',
//         paint: {
//             'line-color': '#013220',  
//             'line-width': 5,          
//             'line-opacity': 0.6       
//         }
//     });

//     // Load station data
//     const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';
//     d3.json(jsonurl).then(jsonData => {
//         stations = jsonData.data.stations;
//         updateVisualization();
//     }).catch(error => console.error('Error loading JSON:', error));

//     // Load trip data and apply filtering
//     const tripsUrl = 'https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv';
//     d3.csv(tripsUrl).then(tripData => {
//         trips = tripData.map(d => ({ 
//             ...d, 
//             start_time: new Date(d.start_time), 
//             end_time: new Date(d.end_time)
//         }));
//         updateVisualization();
//     }).catch(error => console.error('Error loading CSV:', error));

//     map.on('move', updatePositions);
//     map.on('zoom', updatePositions);
//     map.on('resize', updatePositions);
//     map.on('moveend', updatePositions);
// });

// // Compute station traffic with time filtering
// function computeStationTraffic(stations, trips, timeFilter) {
//     const departures = d3.rollup(
//         trips.filter(d => timeFilter === -1 || d.start_time.getMinutes() === timeFilter),
//         v => v.length,
//         d => d.start_station_id
//     );

//     const arrivals = d3.rollup(
//         trips.filter(d => timeFilter === -1 || d.end_time.getMinutes() === timeFilter),
//         v => v.length,
//         d => d.end_station_id
//     );

//     return stations.map(station => {
//         let id = station.short_name;
//         station.arrivals = arrivals.get(id) ?? 0;
//         station.departures = departures.get(id) ?? 0;
//         station.totalTraffic = station.arrivals + station.departures;
//         return station;
//     });
// }

// // Update visualization
// function updateVisualization() {
//     if (!stations || !trips) return;
    
//     stations = computeStationTraffic(stations, trips, timeFilter);
//     const radiusScale = d3.scaleSqrt()
//         .domain([0, d3.max(stations, d => d.totalTraffic)])
//         .range([0, 25]);
    
//     circles = svg.selectAll('circle')
//         .data(stations, d => d.short_name)
//         .join('circle')
//         .attr('r', d => radiusScale(d.totalTraffic))
//         .attr('cx', d => getCoords(d).cx)
//         .attr('cy', d => getCoords(d).cy)
//         .on('mouseover', (event, d) => {
//             tooltip.style('visibility', 'visible')
//                 .text(`${d.totalTraffic} trips (${d.departures} departures, ${d.arrivals} arrivals)`) 
//                 .style('left', (event.pageX + 10) + 'px')
//                 .style('top', (event.pageY + 10) + 'px');
//         })
//         .on('mousemove', event => {
//             tooltip.style('left', (event.pageX + 10) + 'px')
//                 .style('top', (event.pageY + 10) + 'px');
//         })
//         .on('mouseout', () => {
//             tooltip.style('visibility', 'hidden');
//         });
// }

// // Time filtering functionality
// const timeSlider = document.getElementById('time-slider');
// const selectedTime = document.getElementById('selected-time');
// const anyTimeLabel = document.getElementById('any-time');
// let timeFilter = -1;

// timeSlider.addEventListener('input', updateTimeDisplay);

// function formatTime(minutes) {
//     const date = new Date(0, 0, 0, 0, minutes);
//     return date.toLocaleString('en-US', { timeStyle: 'short' });
// }

// function updateTimeDisplay() {
//     timeFilter = Number(timeSlider.value);
    
//     if (timeFilter === -1) {
//         selectedTime.textContent = '';
//         anyTimeLabel.style.display = 'block';
//     } else {
//         selectedTime.textContent = formatTime(timeFilter);
//         anyTimeLabel.style.display = 'none';
//     }
//     updateVisualization();
// }

// // Function to get projected coordinates
// function getCoords(station) {
//     const point = new mapboxgl.LngLat(+station.lon, +station.lat);
//     const { x, y } = map.project(point);
//     return { cx: x, cy: y };
// }

// // Function to update circle positions when the map moves/zooms
// function updatePositions() {
//     circles.attr('cx', d => getCoords(d).cx)
//            .attr('cy', d => getCoords(d).cy);
// }

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
        
        stations = jsonData.data.stations;
        console.log('Stations Array:', stations);

        updateVisualization();
    }).catch(error => {
        console.error('Error loading JSON:', error);
    });

    // Load trip data
    const tripsUrl = 'https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv';
    d3.csv(tripsUrl).then(tripData => {
        console.log('Loaded Traffic Data:', tripData);
        trips = tripData;
    
        stations = computeStationTraffic(stations, trips);
        updateVisualization();
    }).catch(error => {
        console.error('Error loading CSV:', error);
    });

    map.on('move', updatePositions);
    map.on('zoom', updatePositions);
    map.on('resize', updatePositions);
    map.on('moveend', updatePositions);
});

function computeStationTraffic(stations, trips) {
    const departures = d3.rollup(trips, v => v.length, d => d.start_station_id);
    const arrivals = d3.rollup(trips, v => v.length, d => d.end_station_id);
  
    return stations.map(station => {
        let id = station.short_name;
        station.arrivals = arrivals.get(id) ?? 0;
        station.departures = departures.get(id) ?? 0;
        station.totalTraffic = station.arrivals + station.departures;
        return station;
    });
}

function updateVisualization() {
    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(stations, d => d.totalTraffic)])
        .range([0, 25]);

    circles = svg.selectAll('circle')
        .data(stations)
        .join('circle')
        .attr('r', d => radiusScale(d.totalTraffic))
        .attr('cx', d => getCoords(d).cx)
        .attr('cy', d => getCoords(d).cy)
        .each(function(d) {
            d3.select(this).append('title')
                .text(`${d.totalTraffic} trips (${d.departures} departures, ${d.arrivals} arrivals)`);
        });
}

function getCoords(station) {
    const point = new mapboxgl.LngLat(+station.lon, +station.lat);
    const { x, y } = map.project(point);
    return { cx: x, cy: y };
}

function updatePositions() {
    circles.attr('cx', d => getCoords(d).cx)
           .attr('cy', d => getCoords(d).cy);
}

const timeSlider = document.getElementById('time-slider');
const selectedTime = document.getElementById('selected-time');
const anyTimeLabel = document.getElementById('any-time');

function formatTime(minutes) {
    const date = new Date(0, 0, 0, 0, minutes);
    return date.toLocaleString('en-US', { timeStyle: 'short' });
}

function updateTimeDisplay() {
    timeFilter = Number(timeSlider.value);
    
    if (timeFilter === -1) {
        selectedTime.textContent = '';
        anyTimeLabel.style.display = 'block';
    } else {
        selectedTime.textContent = formatTime(timeFilter);
        anyTimeLabel.style.display = 'none';
    }
}

timeSlider.addEventListener('input', updateTimeDisplay);
updateTimeDisplay();
