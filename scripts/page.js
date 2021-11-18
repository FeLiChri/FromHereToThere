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
      inPlayMode: false, // TODO: set to false if in edit mode
      publishLabel: "Publish",
      // TODO: diff between current hunt being made vs. being played?
      currHunt: {
        expectedDistance: 0,
        expectedTime: 30,
        title: "", // TODO: add id
        icon: "",
        id: 0,

        inProgress: {
          timeSoFar: 0,
          distanceSoFar: 0,
          numPoints: 0,
          currStop: 0,
          numMarkers: 0,
          guessText: "",
          tempGuess: "",
          hintClicked: false,
          tryAgain: false,
          correct: false,
        },
        // TODO: when they publish, remove spaces from ends of all answers
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
        ],
      },
      allHunts: [{
        expectedDistance: 1.6,
        expectedTime: 60,
        title: "Welcome Home",
        icon: "src/welcomeHomeIcon.png",
        id:0,
        inProgress: {
          timeSoFar: 0,
          distanceSoFar: 0,
          numPoints: 0,
          currStop: 0,
          guessText: "",
          tempGuess: "",
          hintClicked: false,
          tryAgain: false,
          correct: false,
        },
        // TODO: when they publish, remove spaces from ends of all answers
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
        ],
      }, 
    {
      expectedDistance: 2,
      expectedTime: 120,
      title: "Arbor Adventure", // TODO: add id
      icon: "src/arborAdventureIcon.png",
      id:1,
      inProgress: {
        timeSoFar: 0,
        distanceSoFar: 0,
        numPoints: 0,
        currStop: 0,
        guessText: "",
        tempGuess: "",
        hintClicked: false,
        tryAgain: false,
        correct: false,
      },
      // TODO: when they publish, remove spaces from ends of all answers
      stops: [
        {
          clue: "The arb has a special bed of this kind of flower",
          answer: "Peony",
          hint: "It starts with 'p'",
          task: "Take a photo smelling the flowers.",
          points: 15,
          latlong: L.latLng(42.2808, -83.7430),
          expanded: true,
        },
        {
          clue: "You can see this playwright performed in the Arb",
          answer: "Shakespeare",
          hint: "The bard himself",
          task: "Take a photo on stage, giving your best 'to be or not to be'",
          points: 15,
          latlong: L.latLng(42.2808, -83.7430),
          expanded: true,
        },
      ],
    },
    {
      expectedDistance: 2,
      expectedTime: 120,
      title: "Book Bonanza",
      icon: "src/bookBonanzaIcon.png",
      id:2,
      inProgress: {
        timeSoFar: 0,
        distanceSoFar: 0,
        numPoints: 0,
        currStop: 0,
        guessText: "",
        tempGuess: "",
        hintClicked: false,
        tryAgain: false,
        correct: false,
      },
      // TODO: when they publish, remove spaces from ends of all answers
      stops: [
        {
          clue: "Famous for it's typewriter theme",
          answer: "Literati",
          hint: "It starts with 'lit'",
          task: "Take a photo of your typewritten message.",
          points: 15,
          latlong: L.latLng(42.2808, -83.7476),
          expanded: true,
        },
        {
          clue: "Pick up a new comic or your next favorite game here",
          answer: "Vault of Midnight",
          hint: "Three words (_ of _)",
          task: "Take a photo with a cool character",
          points: 15,
          latlong: L.latLng(42.2801, -83.7484),
          expanded: true,
        },
      ],
    },],      
    };
  },
  mounted() {
    if (this.inPlayMode) {
      console.log("currHunt: ");
      console.log(this.currHunt);
      qs = this.parseQueryString();
      console.log(qs.huntId);
      this.currHunt = this.allHunts[qs.huntId];
      console.log("currHunt: ");
      console.log(this.currHunt);
    }

  	const this_map = this.$refs.mymap.mapObject;
    routermap = this_map;
    // map.addControl(new L.Control.Fullscreen());

    console.log(this.makeMarkers);

    markers = this.inPlayMode ? this.guessMarkers : this.makeMarkers;

    this.router = L.Routing.control({
      // TODO: check waypoints appearing
      waypoints: markers,   
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
    loadHunt: function(id){
      console.log("loadHunt");
      location.href = "play_page.html?huntId="+id;
      console.log("loadHunt");
      // Start countdown of time remaining


      // update time so far
      // setInterval(function(){
      //   this.currHunt.inProgress.timeSoFar += 1;
      //   console.log("updated time");
      //     }

      // , 10000);
    },
    registerMarker: function(e) {
        console.log(e);
    },
    setTimeAndDistance: function(time, distance) {
        console.log(time, distance);
        this.currHunt.expectedDistance = distance.toFixed(2);
        this.currHunt.expectedTime = time.toFixed(2);
    },
    updateGuess: function() {
      if (this.currHunt.inProgress.guessText.length < this.currHunt.inProgress.tempGuess.length) {
        // Backspace
        this.currHunt.inProgress.guessText = this.currHunt.inProgress.guessText.substring(0, this.currHunt.inProgress.guessText.length - 1);
      } else {
        // Type something
        this.currHunt.inProgress.guessText = this.currHunt.inProgress.guessText + " ";
      }
      this.currHunt.inProgress.guessText = this.currHunt.inProgress.guessText.toUpperCase();
      this.currHunt.inProgress.tempGuess = this.currHunt.inProgress.guessText;
    },
    showHint: function() {
      this.currHunt.inProgress.hintClicked = true;
    },
    convertAnswerToCaps: function(answer) {
      console.log(answer);
      console.log(answer.toUpperCase().split('').join(' '));
      return answer.toUpperCase().split('').join(' ') + ' ';
    },
    makeGuess: function() {
      if (this.currHunt.inProgress.guessText == this.convertAnswerToCaps(this.currHunt.stops[this.currHunt.inProgress.currStop].answer)) {
        console.log("Correct!");
        this.currHunt.inProgress.tryAgain = false;
        this.currHunt.inProgress.correct = true;
        this.currHunt.inProgress.numPoints += this.currHunt.stops[this.currHunt.inProgress.currStop].points;
        this.currHunt.inProgress.numMarkers += 1;

        markers = this.guessMarkers;

        this.router = L.Routing.control({
          // TODO: check waypoints appearing
          waypoints: markers,   
          routeWhileDragging: false,
          // TODO: fix dragging problem
          lineOptions: {
            addWaypoints: false,
          },
          show: false,
          units: 'imperial',
          // summaryTemplate: '<h2>{name}</h2><h3>{distance}, {time}</h3>',
        });

        // TODO: figure out how to replace the router
            
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

      } else {
        console.log("Wrong Guess!");
        this.currHunt.inProgress.tryAgain = true;
      }
    },
    pressNuclear: function() {
      this.currHunt.inProgress.numPoints -= 50;
      this.currHunt.inProgress.correct = true;
    },
    nextClue: function() {
      console.log("NEXT CLUE");
      if (this.currHunt.inProgress.currStop == this.currHunt.stops.length - 1) {
        alert("CONGRATULATIONS YOU'RE DONE!");
      } else {
        this.currHunt.inProgress.currStop += 1;
        this.currHunt.inProgress.guessText = "";
        this.currHunt.inProgress.tempGuess = "";
        this.currHunt.inProgress.hintClicked = false;
        this.currHunt.inProgress.tryAgain = false;
        this.currHunt.inProgress.correct = false;
      }
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
    deleteStop: function(x) {
      console.log("delete stop" +  x);
      // TODO: fix deletion
      // this.currHunt.stops = [...this.currHunt.stops.slice(0, x).concat(this.currHunt.stops.slice(-x))];
    },
    publish: function() {
      // TODO: error checking!
      // TODO: increment id when adding this
      this.publishLabel = "Download";
      console.log("publish");

      // convert JSON object to string
      this.allHunts.push(this.currHunt);

      // convert JSON object to string
      var hunt_data = JSON.stringify(this.allHunts);

      // set up automatic download
      (function() {
        var textFile = null,
          makeTextFile = function(text) {
            var data = new Blob([text], {
              type: 'application/json'
            });
      
            // If we are replacing a previously generated file we need to
            // manually revoke the object URL to avoid memory leaks.
            if (textFile !== null) {
              window.URL.revokeObjectURL(textFile);
            }
      
            textFile = window.URL.createObjectURL(data);
      
            return textFile;
          };
      
        var publish = document.getElementById('publish');
      
        publish.addEventListener('click', function() {
          var link = document.createElement('a');
          link.setAttribute('download', 'hunts.json');
          link.href = makeTextFile(hunt_data);
          document.body.appendChild(link);
      
          // wait for the link to be added to the document
          window.requestAnimationFrame(function() {
            var event = new MouseEvent('click');
            link.dispatchEvent(event);
            document.body.removeChild(link);
          });
      
        }, false);
      })();
    },
    parseQueryString: function() {
      // This function is anonymous, is executed immediately and 
      // the return value is assigned to QueryString!
      var query_string = {};
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
            // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
          query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
          var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
          query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
          query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
      } 
      return query_string;
    },
  }, 
  computed: {
    makeMarkers: function() {
      console.log(this.currHunt.stops.map(s => s.latlong));
      return this.currHunt.stops.map(s => s.latlong);
    },
    guessMarkers: function() {
      console.log("GUESS MARKERS");
      if (!this.currHunt.inProgress.numMarkers) {
        return []
      }
      return this.makeMarkers.slice(0, this.currHunt.inProgress.numMarkers);
    }, 
    answerLength: function() {
      return this.placeholder.length;
    },
    placeholder: function() {
      hashes = '_'.repeat(this.currHunt.stops[this.currHunt.inProgress.currStop].answer.length).split('').join(' ');
      console.log(hashes);
      return hashes;
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
