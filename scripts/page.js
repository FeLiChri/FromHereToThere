var { LMap, LTileLayer, LMarker, LTooltip } = Vue2Leaflet;

var routermap;

$(document).on("keydown", ":input:not(textarea)", function(event) {
  return event.key != "Enter";
});

// Callback from Nominatim returning geolocations
window.cb = function cb(json) {
  console.log("Geolocations returned");
  console.log(json);
  possibleLocations = json.map(e => {
    return {
      "name": e.display_name,
      "latlong": [e.lat, e.lon],
    }
  });

  if (json.length == 0) {
    map.currStop.noLocationResults = true;
  }
  else {
    map.currStop.noLocationResults = false;
  }
  map.currStop.possibleLocations = possibleLocations;
}

map = new Vue({
  el: '#app',
  components: { LMap, LTileLayer, LMarker, LTooltip },
  data() {
    return {
      select_min: null,
      select_hrs: null,
      inPlayMode: false,
      expandLastAcc: false,
      page: "index", // options ["index", "play", "create", "join"]
      mapConfig: {
        zoom:14,
        center: L.latLng(42.2808, -83.7430),
        url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      },
      tempImg: null,
      currHunt: {
        id: 0,
        completed: false,
        expectedDistance: 0,
        markerDistance: 0,
        expectedTime: 30,
        title: "",
        iconName: "",
        iconSrc: "",
        errorString: "",

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
          evidence: [],
        },
        finalStats: {
          numPoints: null,
          timeTaken: null,
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
            location: "Hatcher Graduate Library, 913, South University Avenue, Ann Arbor, Washtenaw County, Michigan, 48109, United States",
            possibleLocations: [],
            noLocationResults: false,
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
            noLocationResults: false,
          },
        ],
      },
      allHunts: [
      {
        id:0,
        completed: false,
        expectedDistance: 1.6,
        markerDistance: 0,
        expectedTime: 60,
        title: "Welcome Home",
        iconSrc: "src/icons/welcomeHomeIcon.png",
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
          evidence: [],
        },
        finalStats: {
          numPoints: null,
          timeTaken: null,
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
            noLocationResults: false,
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
            noLocationResults: false,
          },
        ],
      }, 
      {
        id:1,
        completed: false,
        expectedDistance: 2,
        markerDistance: 0,
        expectedTime: 120,
        title: "Arbor Adventure",
        iconSrc: "src/icons/arborAdventureIcon.png",
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
          evidence: [],
        },
        finalStats: {
          numPoints: null,
          timeTaken: null,
        },
        stops: [
          {
            clue: "The arb has a special bed of this kind of flower",
            answer: "Peony",
            hint: "It starts with 'p'",
            task: "Take a photo smelling the flowers.",
            points: 15,
            latlong: L.latLng(42.281052200000005, -83.72563665037023),
            expanded: true,
          },
          {
            clue: "You can see this playwright performed in the Arb",
            answer: "Shakespeare",
            hint: "The bard himself",
            task: "Take a photo on stage, giving your best 'to be or not to be'",
            points: 15,
            latlong: L.latLng(42.2790761, -83.72237684062637),
            expanded: true,
          },
        ],
      },
      {
        id:2,
        completed: false,
        expectedDistance: 2,
        markerDistance: 0,
        expectedTime: 120,
        title: "Book Bonanza",
        iconSrc: "src/icons/bookBonanzaIcon.png",
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
          evidence: [],
        },
        finalStats: {
          numPoints: null,
          timeTaken: null,
        },
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
        ]
      }],
      icons: {
        'apple': {selected: false, name: 'apple', src: 'src/icons/apple.jpg'},   
        'arrow': {selected: false, name: 'arrow', src: 'src/icons/arrow.jpg'},   
        'bank': {selected: false, name: 'bank', src: 'src/icons/bank.jpg'},   
        'basketball': {selected: false, name: 'basketball', src: 'src/icons/basketball.jpg'},   
        'blockM': {selected: false, name: 'blockM', src: 'src/icons/blockM.jpg'},   
        'book': {selected: false, name: 'book', src: 'src/icons/book.jpg'},   
        'camera': {selected: false, name: 'camera', src: 'src/icons/camera.jpg'},   
        'computer': {selected: false, name: 'computer', src: 'src/icons/computer.jpg'},   
        'cube': {selected: false, name: 'cube', src: 'src/icons/cube.jpg'},   
        'dollar': {selected: false, name: 'dollar', src: 'src/icons/dollar.jpg'},   
        'drop': {selected: false, name: 'drop', src: 'src/icons/drop.jpg'},   
        'exclamation': {selected: false, name: 'exclamation', src: 'src/icons/exclamation.jpg'},   
        'flag': {selected: false, name: 'flag', src: 'src/icons/flag.jpg'},   
        'food': {selected: false, name: 'food', src: 'src/icons/food.jpg'},   
        'footsteps': {selected: false, name: 'footsteps', src: 'src/icons/footsteps.jpg'},   
        'geoloc': {selected: false, name: 'geoloc', src: 'src/icons/geoloc.jpg'},   
        'heart': {selected: false, name: 'heart', src: 'src/icons/heart.jpg'},   
        'house': {selected: false, name: 'house', src: 'src/icons/house.jpg'},   
        'magnify': {selected: false, name: 'magnify', src: 'src/icons/magnify.jpg'},   
        'mug': {selected: false, name: 'mug', src: 'src/icons/mug.jpg'},   
        'painting': {selected: false, name: 'painting', src: 'src/icons/painting.jpg'},   
        'people': {selected: false, name: 'people', src: 'src/icons/people.jpg'},   
        'person': {selected: false, name: 'person', src: 'src/icons/person.jpg'},   
        'plant': {selected: false, name: 'plant', src: 'src/icons/plant.jpg'},   
        'puzzle': {selected: false, name: 'puzzle', src: 'src/icons/puzzle.jpg'},   
        'question': {selected: false, name: 'question', src: 'src/icons/question.jpg'},   
        'smiley': {selected: false, name: 'smiley', src: 'src/icons/smiley.jpg'},   
        'snowflake': {selected: false, name: 'snowflake', src: 'src/icons/snowflake.jpg'},   
        'snowman': {selected: false, name: 'snowman', src: 'src/icons/snowman.jpg'},   
        'spiral': {selected: false, name: 'spiral', src: 'src/icons/spiral.jpg'},   
        'star': {selected: false, name: 'star', src: 'src/icons/star.jpg'},   
        'sun': {selected: false, name: 'sun', src: 'src/icons/sun.jpg'},   
        'taco': {selected: false, name: 'taco', src: 'src/icons/taco.jpg'},   
        'theatre': {selected: false, name: 'theatre', src: 'src/icons/theatre.jpg'},   
        'tree': {selected: false, name: 'tree', src: 'src/icons/tree.jpg'},   
      },
    };
  },
  mounted() {},
  updated() {
    e = document.getElementById('#collapse' + this.currHunt.stops.length - 1);
    if (this.expandLastAcc) {
      this.expandLastAcc = false;
      $('#collapse' + String(this.currHunt.stops.length - 1)).collapse('show');
      setTimeout(this.adjustMap, 250);
    }
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip({
          placement : 'right',
      });
    });
  },
  methods: {
    selectIcon(iconName){
      if (this.currHunt.iconName !== "") {
        this.icons[this.currHunt.iconName].selected = false;
      }
      this.currHunt.iconName = iconName;
      this.icons[iconName].selected = true;
      this.currHunt.iconSrc = this.icons[iconName].src;
    },
    loadHunt: function(id){
      this.page = "play";
      this.inPlayMode = true;
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
      return answer.toUpperCase().split('').join('\xa0');
    },
    checkAnswer: function(answer, guess) {
      // Strip all non-alphanumeric characters
      stripped_answer = answer.replace(/\W/g, '').toUpperCase();
      stripped_guess = guess.replace(/\W/g, '').toUpperCase();

      return stripped_answer === stripped_guess;
    },
    adjustMap: function() {
      var this_map;

      if (this.inPlayMode) {
        this_map = this.$refs.mymapGuess.mapObject;
      } else {
        this_map = this.$refs.mymapMake.mapObject;
      }

      this_map.invalidateSize();
      this_map.fitBounds(this.markers);
    },
    updateRoute: function(markers) {
      if (this.router) {
        routermap.removeControl(this.router);
      } 

      var this_map;
      if (this.inPlayMode) {
        this_map = this.$refs.mymapGuess.mapObject;
      } else {
        this_map = this.$refs.mymapMake.mapObject;
      }
      routermap = this_map;

      this.router = L.Routing.control({
        waypoints: markers,   
        routeWhileDragging: false,
        // TODO: fix dragging problem
        lineOptions: {
          addWaypoints: false,
        },
        show: false,
        units: 'imperial',
      });

      // TODO: figure out how to replace the router
          
      this.router.on('routesfound', function(e) {
          var routes = e.routes;
          var summary = routes[0].summary;
          map.currHunt.markerDistance = (summary.totalDistance / 1760).toFixed(2);
          map.currHunt.expectedTime = (map.currHunt.markerDistance * 20).toFixed(2);
      });
      
      this.router.addTo(routermap);
      this_map.fitBounds(markers);

    },
    makeGuess: function() {
      if (this.checkAnswer(this.currStop.answer, this.currHunt.inProgress.guessText)) {
        this.currHunt.inProgress.tryAgain = false;
        this.currHunt.inProgress.correct = true;
        this.currHunt.inProgress.numPoints += this.currStop.points;
        this.currHunt.inProgress.numMarkers += 1;

        markers = this.guessMarkers;

        this.updateRoute(markers);
      } else {
        this.currHunt.inProgress.tryAgain = true;
      }
    },
    pressNuclear: function() {
      this.currHunt.inProgress.numPoints -= 50;
      this.currHunt.inProgress.correct = true;
      this.currHunt.inProgress.numMarkers += 1;
      
      markers = this.guessMarkers;
      this.updateRoute(markers);
    },
    nextClue: function() {
      this.allHunts[this.currHunt.id].inProgress.evidence.push(this.tempImg);
      this.tempImg = null;
      if (this.currHunt.inProgress.currStopId == this.currHunt.stops.length - 1) {
        alert(`CONGRATULATIONS YOU'RE DONE!!!\nTime taken: ${this.currHunt.inProgress.timeSoFar} mins\nPoints: ${this.currHunt.inProgress.numPoints} pts`);
        this.allHunts[this.currHunt.id].completed = true;
        Vue.set(this.allHunts[this.currHunt.id].finalStats, "numPoints", this.currHunt.inProgress.numPoints);
        Vue.set(this.allHunts[this.currHunt.id].finalStats, "timeTaken", this.currHunt.inProgress.timeSoFar);
        console.log(this.allHunts);
        this.goBack();
      } else {
        this.currHunt.inProgress.currStopId += 1;
        this.currHunt.inProgress.guessText = "";
        this.currHunt.inProgress.tempGuess = "";
        this.currHunt.inProgress.hintClicked = false;
        this.currHunt.inProgress.tryAgain = false;
        this.currHunt.inProgress.correct = false;
      }
    },
    prepareEvidence: function(files) {
      console.log("prepareEvidence");
      console.log(files);
      // No file submitted
      if (!files.length) {
        this.tempImg = null;
        return;
      }
      this.tempImg = URL.createObjectURL(files[0]);
      console.log(this.tempImg);

    },
    deleteStop: function(i) {
      if(!confirm('Are you sure you want to delete this stop?')) {
        //don't delete
        return;
      }
      this.currHunt.stops.splice(i, 1);
      this.updateRoute(this.makeMarkers);
      // TODO: decrement currStop if it's after i - make sure it's still open
    },
    addStop: function() {
        this.currHunt.stops.push( {
        clue: "",
        answer: "",
        hint: "",
        task: "",
        points: 15,
        latlong: null,
        expanded: true,
        location: "",
        possibleLocations: [],
      });
        map.currHunt.inProgress.currStopId = this.currHunt.stops.length - 1;
        this.expandLastAcc = true;
    },
    moveStopUp: function(idx, e) {
      // Don't expand accordion.
      e.stopImmediatePropagation();
      e.preventDefault();
      this.expandLastAcc = false;
      console.log("move stop up " + idx);
      if (idx != 0) {
        var temp = this.currHunt.stops[idx];
        Vue.set(this.currHunt.stops, idx, this.currHunt.stops[idx - 1]);
        Vue.set(this.currHunt.stops, idx - 1, temp);
      }

      // $('#accordian-item-'+String(idx)).collapse('hide');
      this.updateRoute(this.makeMarkers);
      this.adjustMap();
    },
    moveStopDown: function(idx, e) {
      // Don't expand accordion.
      e.stopImmediatePropagation();
      e.preventDefault();

      this.expandLastAcc = false;

      console.log("move stop down " + idx);
      if (idx < this.currHunt.stops.length - 1) {
        var temp = this.currHunt.stops[idx];
        Vue.set(this.currHunt.stops, idx, this.currHunt.stops[idx + 1]);
        Vue.set(this.currHunt.stops, idx + 1, temp);
      }
      this.updateRoute(this.makeMarkers);
      this.adjustMap();

    },
    publish: function() {
      // Check for additional errors that are outside forms.
      this.currHunt.errorString = ''

      if (this.currHunt.title === "") {
        this.currHunt.errorString += "Provide a title for your hunt.<br>"
      }
      if (this.currHunt.iconSrc === "") {
        this.currHunt.errorString += "Select an icon for your hunt.<br>"
      }
      if (this.currHunt.stops.length === 0) {
        this.currHunt.errorString += "Provide at least one stop.<br>"
      }
      if (!$("#minutes").val() || !$("#hours").val()) {
        this.currHunt.errorString += "Set a time limit.<br>"
      }

      allFormsValid = this.allFormsValid();

      if (allFormsValid[1]) {
        this.currHunt.errorString += "Fix invalid stops.<br>"
      }
      
      // Error check all forms on the page (time limit, individual stops, title)
      if (allFormsValid[0]) {
        // No additional errors! Go ahead and publish.
        if (this.currHunt.errorString === "") {
          // TODO: check for 0 hours 0 minutes make time limit
          var timelimit = Number($("#minutes").val()) + Number((60 * $("#hours").val()));

          console.log(timelimit);
          // Strip any trailing whitespace
          this.currHunt.stops.forEach( s => s.answer.trim());

          this.currHunt.expectedTime = timelimit;
          // Reset marker distance
          this.currHunt.expectedDistance = this.currHunt.markerDistance;
          this.currHunt.markerDistance = 0;
          this.allHunts.push(this.currHunt);

          console.log(JSON.stringify(this.allHunts));
          this.switchPage("join");
          this.currStopId = 0;
        }     
      }
    },    
    searchLocation: function(q) {
      query = q;
      console.log(q)

      cleaned_query = query.replace(' ', '+');

      if (!cleaned_query.includes("ann") && !cleaned_query.includes("Ann")) {
        cleaned_query +=  ",ann+arbor";
      }

      // With help from: https://stackoverflow.com/questions/10923769/simple-reverse-geocoding-using-nominatim
      var s = document.createElement('script');     
      s.setAttribute("id", "locSearchScript");  
      s.src = 'http://nominatim.openstreetmap.org/search?json_callback=cb&format=json&q=' + cleaned_query;
      document.getElementsByTagName('head')[0].appendChild(s);
    }, 
    setLocation(stop_i, possible_loc_i) {
      chosenLoc = this.currHunt.stops[stop_i].possibleLocations[possible_loc_i];
      this.currHunt.stops[stop_i].latlong = L.latLng(chosenLoc.latlong[0], chosenLoc.latlong[1])
      this.currHunt.stops[stop_i].location = chosenLoc.name;
      
      // TODO: prefer to keep previous possible locations? and just hide them after click?
      this.currHunt.stops[stop_i].possibleLocations = [];

      this.updateRoute(this.makeMarkers);
      
      $('#loc'+stop_i).hide();
    }, 
    setActiveStop: function(i) {
      this.currHunt.inProgress.currStopId = i;
    }, 
    switchPage: function(pageIn, idIn=null) {
      this.page = pageIn;

      if (pageIn == "join") {
      //   var s = document.createElement('script');     
      //   s.setAttribute("id", "confetti");  
      //   s.src = "scripts/confetti.js";
      // document.getElementsByTagName('head')[0].appendChild(s);
        this.inPlayMode = false;
      } else if (pageIn == "create") {
        this.inPlayMode = false;
        this.select_min = null;
        this.select_hrs = null;
        this.expandLastAcc = false;
        // Initialize new blank hunt
        this.currHunt = {
            expectedDistance: 0,
            markerDistance: 0,
            expectedTime: 0,
            title: "",
            iconName: "",
            iconSrc: "",
            id: this.allHunts.length,
            errorString: '',
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
              evidence: [],
            },
            finalStats: {
              numPoints: null,
              timeTaken: null,
            },
            stops: [],
        };
      } else if (pageIn == "play") {
        this.inPlayMode = true;
        this.currHunt = this.allHunts[idIn];
        console.log(this.currHunt);

        this.currHunt.inProgress = {
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
            evidence: [],
          };

        setInterval(()=>{
          this.currHunt.inProgress.timeSoFar += 1;

          }
          , 60000);

      } else if (pageIn == "index") {
        this.inPlayMode = false;
      } else {
        console.log("Not a valid page to switch to: " + pageIn);
      }
    }, 
    goBack: function() {
      if (this.page == "play") {
        this.switchPage("join");
        return;
      }
      if(this.page == "create") {
        if(!confirm('Are you sure you want to return? Your hunt may not be saved.')) {
          //dont' return
          return;
        }
      }
      this.switchPage("index");
    },
    validateForm: function(formName) {
      var form = document.querySelector(formName + '.needs-validation');
      var header = document.querySelector('#accordion-item-' + formName[formName.length - 1]);

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        if (!form.checkValidity()) {
          invalidFormsPresent = true;
          header.classList.add('invalid');
        }
        else {
          header.classList.remove('invalid');
          $('#collapse' + String(this.currHunt.inProgress.currStopId)).collapse('hide');
          setTimeout(this.adjustMap, 250);
        }
        form.classList.add('was-validated');
    },
    allFormsValid: function() {
      var forms = document.querySelectorAll('.needs-validation')
      
      // Loop over them and prevent submission

      invalidFormsPresent = false;
      invalidStopForm = false;

      forms.forEach(form => {
        var header = document.querySelector('#accordion-item-' + form.id[form.id.length - 1]);

          // Fetch all the forms we want to apply custom Bootstrap validation styles to
          if (!form.checkValidity()) {
            invalidFormsPresent = true;
            if (header) {
              header.classList.add('invalid');
              invalidStopForm = true;
            }
          }
          else {
            if (header) {
              header.classList.remove('invalid')
            }
          }
          form.classList.add('was-validated');
      })

      return [!invalidFormsPresent, invalidStopForm];
    },
  }, 
  computed: {
    makeMarkers: function() {
      return this.currHunt.stops.map(s => s.latlong);
    },
    guessMarkers: function() {
      if (!this.currHunt.inProgress.numMarkers) {
        return []
      }
      return this.makeMarkers.slice(0, this.currHunt.inProgress.numMarkers);
    }, 
    markers: function() {
      return this.currHunt.inPlayMode ? this.guessMarkers : this.makeMarkers;
    },
    getStopNames: function() {
      return this.currHunt.stops.map(s => s.answer);
    },
    answerLength: function() {
      return this.placeholder.length;
    },
    placeholder: function() {
      var alphanumRegex = /^[0-9a-zA-Z]+$/;
      hashes = "";

      for (var i = 0; i < this.currStop.answer.length; i++) {
        l = this.currStop.answer[i];
        if (l.match(alphanumRegex)) {
          // Need \xa0 as non-breaking whitespace so the form will keep whitespaces
          hashes += '_' + '\xa0';
        }
        else {
          hashes += l + '\xa0';
        }
      }
      // hashes = '_'.repeat(this.currStop.answer.length).split('').join(' ');
      return hashes.substring(0, hashes.length - 1);
    },
    currStop: function() {
      return this.currHunt.stops[this.currHunt.inProgress.currStopId];
    },
    onIndexPage: function() {
      return this.page == "index";
    },
    onJoinPage: function() {
      return this.page == "join";
    },
    onCreatePage: function() {
      return this.page == "create";
    },
    onPlayPage: function() {
      return this.page == "play";
    },
    iconSelected: function() {
      return this.currHunt.iconName !== '';
    }
  }
});

function auto_height(elem) {  /* javascript */
  elem.style.height = "1px";
  elem.style.height = (elem.scrollHeight)+"px";
}
