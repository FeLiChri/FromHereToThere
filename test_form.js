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

  if (json.length == 0) {
    map.noLocationResults = true;
  }
  else {
    map.noLocationResults = false;
  }
  console.log(possibleLocations);
//   console.log(map.currHunt.inProgress.currStopId);
  console.log("Assign possible locations");
  map.possibleLocations = possibleLocations;
}

map = new Vue({
  el: '#app',
  components: { LMap, LTileLayer, LMarker, LTooltip },
  data() {
    return {
        clue: "",
        answer: "",
        hint: "",
        task: "",
        points: 15,
        latlong: null,
        expanded: true,
        location: "",
        possibleLocations: [],
        i: 0,
        noLocationResults: false,
    }
  },
  mounted() {
  },
  updated() {
  },
  methods: {
    validateForm: function() {
      console.log("validate form");
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.querySelectorAll('.needs-validation')
      
        console.log("VALIDATING FORMS");
        console.log(forms);
        // Loop over them and prevent submission
        Array.prototype.slice.call(forms)
          .forEach(function (form) {
            form.addEventListener('click', function (event) {
              if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
              }
      
              form.classList.add('was-validated')
            }, false)
          })
    },
    searchLocation: function(q) {
        // query = e.target.value;
        query = q;
        console.log(q)
        // console.log("Searching for " + e.target.value);
    
        cleaned_query = query.replace(' ', '+');
    
        if (!cleaned_query.includes("ann") && !cleaned_query.includes("Ann")) {
          cleaned_query +=  ",ann+arbor";
        }
    
        // TODO: overwrite
        // With help from: https://stackoverflow.com/questions/10923769/simple-reverse-geocoding-using-nominatim
        var s = document.createElement('script');     
        s.setAttribute("id", "locSearchScript");  
        s.src = 'http://nominatim.openstreetmap.org/search?json_callback=cb&format=json&q=' + cleaned_query;
        document.getElementsByTagName('head')[0].appendChild(s);
        // TODO: attribute!
        // // console.log("Calling iTunes API with: https://itunes.apple.com/search?attribute=allArtistTerm&term=" + cleaned_query);
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
  }, 
});

// console.log("I think Vue just rendered?");
// console.log(map.makeMarkers);

