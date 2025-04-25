mapboxgl.accessToken = mapTokenAPI;
const map = new mapboxgl.Map({
    container: 'map',
    // center: [85.8246, 20.2960],
    center: coordinates,
    zoom: 9
});

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .addTo(map)