// Vue.component('l-map', window.Vue2Leaflet.LMap);
// link 'http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.css';
// @import "~leaflet/dist/leaflet.css";

// $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', 'https://unpkg.com/leaflet/dist/leaflet.css'));


// var { LMap, LTileLayer, LMarker } = Vue2Leaflet;

var { LMap, LTileLayer, LMarker, LTooltip } = Vue2Leaflet;

var routermap;

window.cb = function cb(json) {
  //do what you want with the json
  console.log("CALLBACK");
  console.log(json);
  console.log(map.currStop);
  possibleLocations = json.map(e => {
    return {
      "name": e.display_name,
      "latlong": [e.lat, e.lon],
    }
  });
  console.log(possibleLocations);
  console.log(map.currHunt.inProgress.currStopId);
  map.currStop.possibleLocations = possibleLocations;

}

map = new Vue({
  el: '#app',
  components: { LMap, LTileLayer, LMarker, LTooltip },
  data() {
    return {
      mapConfig: {
        zoom:14,
        center: L.latLng(42.2808, -83.7430),
        url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        search_text: '',
      },
      inPlayMode: true, // TODO: set to false if in edit mode
      expandLastAcc: false,
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
          currStopId: 0,
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
            location: "Hatcher Graduate Library, 913, South University Avenue, Ann Arbor, Washtenaw County, Michigan, 48109, United States",
            possibleLocations: [],
          },
          {
            clue: "Where to find computers in Angell Hall.",
            answer: "Fishbowl",
            hint: "Nemo from Finding Nemo might swim in one.",
            task: "Print a poster and upload a photo of the print!",
            points: 15,
            latlong: L.latLng(42.2766, -83.7397),
            expanded: true,
            location: "Angell Hall, 435, South State Street, Ann Arbor, Washtenaw County, Michigan, 48109, United States",
            possibleLocations: [],
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
          numMarkers: 0,
          currStopId: 0,
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
            location: "",
            possibleLocations: [],
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
        numMarkers: 0,
        currStopId: 0,
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
        currStopId: 0,
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
          clue: "Famous for it's typewriter theme",
          answer: "Literati",
          hint: "It starts with 'lit'",
          task: "Take a photo of your typewritten message.",
          points: 15,
          latlong: L.latLng(42.280291,-83.7474556),
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

    // TODO: make this a helper function
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
        // console.log(summary.totalTime % 3600 / 60 + ' min');
        map.currHunt.expectedTime = (summary.totalTime % 3600 / 60).toFixed(2);
        map.currHunt.expectedDistance = (summary.totalDistance / 1760).toFixed(2);
        // map.currHunt.expectedTime = ((summary.totalDistance / (1760 * 2.5)) % 3600 / 60).toFixed(2);

        // alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
    });
    
    this.router.addTo(routermap);
  },
  updated() {
    console.log("Updated!");
    e = document.getElementById('#collapse' + this.currHunt.stops.length - 1);
    console.log(e);
    if (this.expandLastAcc) {
      this.expandLastAcc = false;
      $('#collapse' + String(this.currHunt.stops.length - 1)).collapse('show');
    }
  },
  methods: {
    createNav: function(){
      location.href = "create_page.html";
      inPlayMode = false;
    },
    joinNav: function(){
      location.href = "join_page.html";
      inPlayMode = true;
    },
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
    // TODO: keep commas and spaces and such in the answer
    makeGuess: function() {
      if (this.currHunt.inProgress.guessText == this.convertAnswerToCaps(this.currStop.answer)) {
        console.log("Correct!");
        this.currHunt.inProgress.tryAgain = false;
        this.currHunt.inProgress.correct = true;
        this.currHunt.inProgress.numPoints += this.currStop.points;
        this.currHunt.inProgress.numMarkers += 1;

        markers = this.guessMarkers;
        console.log(this.guessMarkers);

        routermap.removeControl(this.router);
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
      if (this.currHunt.inProgress.currStopId == this.currHunt.stops.length - 1) {
        alert("CONGRATULATIONS YOU'RE DONE!");
      } else {
        this.currHunt.inProgress.currStopId += 1;
        this.currHunt.inProgress.guessText = "";
        this.currHunt.inProgress.tempGuess = "";
        this.currHunt.inProgress.hintClicked = false;
        this.currHunt.inProgress.tryAgain = false;
        this.currHunt.inProgress.correct = false;
      }
    },
    deleteStop: function(i) {
      // TODO: make sure to add an "are you sure? popup"
      this.currHunt.stops.splice(i, 1);
      // TODO: decrement currStop if it's after i - make sure it's still open
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
        location: "",
        possibleLocations: [],
      });
      map.currHunt.inProgress.currStopId = this.currHunt.stops.length - 1;
      console.log("ADD STOP");
      // $("#collapse" + this.currHunt.stops.length - 1).collapse({
      //   show: true
      // });
      // console.log(this.currHunt.stops.length - 1);
      // this.$nextTick(function () {
      //   console.log("TICK");
      //   e = document.getElementById('#collapse' + this.currHunt.stops.length - 1);
      //   console.log(e);
      //   $('#collapse' + this.currHunt.stops.length - 1).collapse('show');
      // });
      // setTimeout( () => {}, 1000);
      
      this.expandLastAcc = true;

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
      console.log(query_string);
      return query_string;
    },    
    searchLocation: function(e) {
    query = e.target.value;
    console.log("Searching for " + e.target.value);

    cleaned_query = query.replace(' ', '+');

    // TODO: overwrite
    // With help from: https://stackoverflow.com/questions/10923769/simple-reverse-geocoding-using-nominatim
    var s = document.createElement('script');     
    s.setAttribute("id", "locSearchScript");  
    s.src = 'http://nominatim.openstreetmap.org/search?json_callback=cb&format=json&q=' + cleaned_query + ",ann+arbor";
    document.getElementsByTagName('head')[0].appendChild(s);
    // TODO: attribute!
    // console.log("Calling iTunes API with: https://itunes.apple.com/search?attribute=allArtistTerm&term=" + cleaned_query);
    // axios.get("https://nominatim.openstreetmap.org/search?email=fee.christoph@gmail.com&q=" + cleaned_query + '+ann+arbor/', {
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     'User-Agent':'Axios 0.21.1',
    //   },
    //   proxy: {
    //     host: 'localhost',
    //     port: 5500
    //   }
    // })
    //   .then(response => {
          
    //     // Log response
    //     console.log("Returned JSON object:");
    //     console.log(response);
    //   }).catch(e => console.log(e));
    }, 
    // TODO: set time to be walking time
    // TODO: also make sure that you can get the possible locations for any location
    setLocation(stop_i, possible_loc_i) {
      chosenLoc = this.currHunt.stops[stop_i].possibleLocations[possible_loc_i];
      this.currHunt.stops[stop_i].latlong = L.latLng(chosenLoc.latlong[0], chosenLoc.latlong[1])
      this.currHunt.stops[stop_i].location = chosenLoc.name;

      markers = this.inPlayMode ? this.guessMarkers : this.makeMarkers;

      routermap.removeControl(this.router);
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
    setActiveStop: function(i) {
      console.log(i);
      this.currHunt.inProgress.currStopId = i;
    }  
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
    getStopNames: function() {
      return this.currHunt.stops.map(s => s.answer);
    },
    answerLength: function() {
      return this.placeholder.length;
    },
    placeholder: function() {
      hashes = '_'.repeat(this.currStop.answer.length).split('').join(' ');
      console.log(hashes);
      return hashes;
    },
    currStop: function() {
      return this.currHunt.stops[this.currHunt.inProgress.currStopId];
    }
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
