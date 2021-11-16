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
        expectedDistance: 0,
        expectedTime: 0,
        title: "",

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
        stops: [
          {
            clue: "Where the graduates study.",
            answer: "Hatcher",
            hint: "It starts with 'hat'",
            task: "Take a photo in the stacks.",
            points: 15,
            latlong: L.latLng(42.2808, -83.7430),
            expanded: true,
          },
          {
            clue: "Where to find computers in Angell Hall.",
            answer: "Fishbowl",
            hint: "Nemo from Finding Nemo might swim in one.",
            task: "Print a poster and upload a photo of the print!",
            points: 15,
            latlong: L.latLng(42.2766, -83.7397),
            expanded: true,
          },
          {
            clue: "",
            answer: "",
            hint: "",
            task: "",
            points: 15,
            latlong: L.latLng(42.2766, -83.7397),
            expanded: true,
          },
        ],
      },
      allHunts: [],      
    };
  },
  mounted() {
  	const this_map = this.$refs.mymap.mapObject;
    routermap = this_map;
    // map.addControl(new L.Control.Fullscreen());

    console.log(this.makeMarkers);
    this.router = L.Routing.control({
      // TODO: check waypoints appearing
      waypoints: this.makeMarkers,   
      routeWhileDragging: false,
      // TODO: fix dragging problem
      lineOptions: {
        addWaypoints: false,
      },
      show: false,
      units: 'imperial',
      // summaryTemplate: '<h2>{name}</h2><h3>{distance}, {time}</h3>',
    });
        
    this.router.on('routesfound', function(e) {
        console.log("ROUTES FOUND");
        console.log(e.waypoints);
        var routes = e.routes;
        var summary = routes[0].summary;
        // alert distance and time in miles and minutes
        console.log(summary.totalDistance / 1760 + ' mi');
        console.log(summary.totalTime % 3600 / 60 + ' min');
        map.currHunt.expectedTime = (summary.totalTime % 3600 / 60).toFixed(2);
        map.currHunt.expectedDistance = (summary.totalDistance / 1760).toFixed(2);
        // alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
    });
    
    this.router.addTo(routermap);
  },
  methods: {
    registerMarker: function(e) {
        console.log(e);
    },
    setTimeAndDistance: function(time, distance) {
        console.log(time, distance);
        this.currHunt.expectedDistance = distance.toFixed(2);
        this.currHunt.expectedTime = time.toFixed(2);
    },
    addStop: function() {
      this.currHunt.stops.push( {
        clue: "",
        answer: "",
        hint: "",
        task: "",
        points: 15,
        latlong: L.latLng(42.2766, -83.7397),
        expanded: true,
      });
    },
    publish: function() {
      // TODO: error checking!
    }
  }, 
  computed: {
    makeMarkers: function() {
      console.log(this.currHunt.stops.map(s => s.latlong));
      return this.currHunt.stops.map(s => s.latlong);
    },
    guessMarkers: function() {
      return this.makeMarkers.slice(0, this.currHunt.inProgress.currStop - 1);
    }, 
  }
});

console.log("I think Vue just rendered?");
console.log(map.makeMarkers);



/*
stops: [
  {
    clue: "Where the graduates study.",
    answer: "Hatcher",
    hint: "It starts with 'hat'",
    task: "Take a photo in the stacks.",
    points: 15,
    latlong: L.latLng(42.2808, -83.7430),
    expanded: true,
  },
  {
    clue: "Where to find computers in Angell Hall.",
    answer: "Fishbowl",
    hint: "Nemo from Finding Nemo might swim in one.",
    task: "Print a poster and upload a photo of the print!",
    points: 15,
    latlong: L.latLng(42.2766, -83.7397),
    expanded: true,
  },
  {
    clue: "",
    answer: "",
    hint: "",
    task: "",
    points: 15,
    latlong: L.latLng(42.2766, -83.7397),
    expanded: true,
  },
],
*/