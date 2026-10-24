
mapboxgl.accessToken = window.mapToken;

const coordinates = window.coordinates;
const listingLocation = window.listingLocation;

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 9
});

map.on("load", () => {
    map.addSource("location-area", {
        type: "geojson",
        data: {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: coordinates
            },
            properties: {}
        }
    });

    map.addLayer({
        id: "location-circle",
        type: "circle",
        source: "location-area",
        paint: {
            "circle-radius": 80,
            "circle-color": "#ff385c",
            "circle-opacity": 0.20,
            "circle-stroke-color": "#ff385c",
            "circle-stroke-opacity": 0.15,
            "circle-stroke-width": 1
        }
    });

    const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false
    }).setHTML(`
        <h4>${listingLocation}</h4>
        <p>Exact location provided after booking</p>
    `);

    new mapboxgl.Marker({ color: "#ff385c" })
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map);
});
