// Vue.component('l-map', window.Vue2Leaflet.LMap);
// link 'http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.css';
// @import "~leaflet/dist/leaflet.css";

// $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', 'https://unpkg.com/leaflet/dist/leaflet.css'));


// var { LMap, LTileLayer, LMarker } = Vue2Leaflet;

var { LMap, LTileLayer, LMarker } = Vue2Leaflet;

var routermap;

map = new Vue({
  el: '#app',
  components: { LMap, LTileLayer, LMarker },
  data() {
    return {
      zoom:14,
      center: L.latLng(42.2808, -83.7430),
      url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      markers: [L.latLng(42.2808, -83.7430), L.latLng(42.2808, -83.7433)],
      distance: 0,
      time: 0,
    };
  },
  mounted() {
  	const map = this.$refs.mymap.mapObject;
    routermap = map;
    // map.addControl(new L.Control.Fullscreen());
  },
  methods: {
    registerMarker: function(e) {
        console.log(e);
    },
    setTimeAndDistance: function(time, distance) {
        this.distance = distance.toFixed(2);
        this.time = time.toFixed(2);
    },
  }
});

// var mymap = $('#mymap')

// L.Routing.control({
//     waypoints: [
//         L.latLng(57.74, 11.94),
//         L.latLng(57.6792, 11.949)
//     ]
// }).addTo(mymap);

// var routermap = window.maps.leafletList[0].map;

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '© OpenStreetMap contributors'
// }).addTo(routermap);

var router = L.Routing.control({
    waypoints: [
        L.latLng(42.2808, -83.7430), 
        L.latLng(42.2808, -83.7460),
    ],
    routeWhileDragging: false,
    addWaypoints: false,
    show: false,
    units: 'imperial',
    // summaryTemplate: '<h2>{name}</h2><h3>{distance}, {time}</h3>',

});

router.on('routesfound', function(e) {
    var routes = e.routes;
    var summary = routes[0].summary;
    // alert distance and time in km and minutes
    console.log(summary.totalDistance / 1760 + ' mi');
    console.log(summary.totalTime % 3600 / 60 + ' min');
    map.setTimeAndDistance(summary.totalTime % 3600 / 60, summary.totalDistance / 1760);
    // alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
 });

router.addTo(routermap);


var searchControl = L.esri.Geocoding.geosearch().addTo(routermap);

var results = L.layerGroup().addTo(routermap);

searchControl.on('results', function (data) {
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
});

  

// // var map = new Vue({
// //     el: '#map-id',
// // data: {
// //     zoom: 13,
// //     path: "/images/",
// //     center: [47.41322, -1.219482],
// //     url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
// //     attribution:
// //         '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
// //     marker: latLng(47.41322, -1.219482),
// // },
// // });

// import { latLng } from "leaflet";
// import { LMap, LTileLayer, LMarker, LIconDefault } from "vue2-leaflet";

// export default {
//   name: "CustomPath",
//   components: {
//     LMap,
//     LTileLayer,
//     LMarker,
//     LIconDefault
//   },
//   data() {
//     return {
//       zoom: 13,
//       path: "/images/",
//       center: [47.41322, -1.219482],
//       url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//       attribution:
//         '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
//       marker: latLng(47.41322, -1.219482)
//     };
//   }
// };
