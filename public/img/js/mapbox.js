// this the js file which we are going to integrate with the html and it will run on the client side 
// console.log("ruuning on the client side okk ");
// now fetching out the location data from the data-location attribute 
// const locationv = JSON.parse(document.getElementById('map').dataset.locations)
// console.log(typeof locationv);

// require('leaflet/dist/leaflet.css');

export const map = (locationv) => {






    maptilersdk.config.apiKey = 'p8d9oDE9rEnZwTtOp8Bh';
    const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style: "dataviz",
        scrollZoom: false
        // center: [16.62662018, 49.2125578], // starting position [lng, lat]
        // zoom: 10, // starting zoom
        // interactive: false
    });

    // const coos=

    // const ll = new maptilersdk.LngLat().toBounds(100).toArray();
    // const bounds = new maptilersdk.LngLatBounds();


    // auto marker availabel 
    // const marker = new maptilersdk.Marker()
    //     .setLngLat([30.5, 50.5])
    //     .addTo(map);


    // can also do mannually
    locationv.forEach(loc => {
        // add marker
        const el = document.createElement('div');
        el.className = 'marker';

        new maptilersdk.Marker({
            element: el,
            anchor: 'bottom',
        }).setLngLat(loc.coordinates).setPopup(new maptilersdk.Popup().trackPointer().setHTML("&lt;h1&gt;Hello World!&lt;/h1&gt;")).addTo(map)


    })

    // let coos = [];
    // locationv.forEach(loc => {
    //     coos.push(loc.coordinates)
    // })
    // console.log(coos);
    // map.fitBounds(coos);






}




