

mapboxgl.accessToken = maptoken;

const map = new mapboxgl.Map({
container: 'map', // container ID
center: coordinates, // starting position [lng, lat]
zoom: 8 // starting zoom
});

console.log(coordinates);


const marker = new mapboxgl.Marker({color: "red"})
        .setLngLat(coordinates) //listing.geometry.cordinates
        .setPopup(new mapboxgl.Popup({offset:25})
        .setHTML(`<h4></h4><p>Exact Location Provided After`)
        )
        
        .addTo(map);