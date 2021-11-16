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
      mapConfig: {
        zoom:14,
        center: L.latLng(42.2808, -83.7430),
        url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      },
      // TODO: diff between current hunt being made vs. being played?
      currHunt: {
        inProgress: {
          timeSoFar: 0,
          distanceSoFar: 0,
          pointsSoFar: 0,
          currStop: 0,
          guessText: "",
          tempGuess: "",
          hintClicked: false,
          tryAgain: false,
          correct: false,
        },
        expectedDistance: 0,
        expectedTime: 0,
        stops: [
          {
            clue: "Where the graduates study.",
            answer: "Hatcher",
            hint: "It starts with 'hat'",
            task: "Take a photo in the stacks.",
            points: 15,
            latlong: L.latLng(42.2808, -83.7430),
          },
          {
            clue: "Where to find computers in Angell Hall.",
            answer: "Fishbowl",
            hint: "Nemo from Finding Nemo might swim in one.",
            task: "Print a poster and upload a photo of the print!",
            points: 15,
            latlong: L.latLng(42.2808, -83.7430),
          },
        ],
      },
      allHunts: [],      
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
        this.currHunt.expectedDistance = distance.toFixed(2);
        this.currHunt.expectedTime = time.toFixed(2);
    },
  }, 
  computed: {
    makeMarkers: function() {
      return this.currHunt.stops.filter(s => s.latlong);
    },
    guessMarkers: function() {
      return this.makeMarkers.slice(0, this.currHunt.inProgress.currStop - 1);
    }
  }
});


var router = L.Routing.control({
    // TODO: check waypoints appearing
    waypoints: map.makeMarkers,   
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

