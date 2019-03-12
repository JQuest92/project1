//GLOBAL VARIABLES-------------
var config = {
  apiKey: "AIzaSyDXmSJLyC2evDbgwIDzbSXAGs2OvXL70_Y",
  authDomain: "spontaneity-dab93.firebaseapp.com",
  databaseURL: "https://spontaneity-dab93.firebaseio.com",
  projectId: "spontaneity-dab93",
  storageBucket: "spontaneity-dab93.appspot.com",
  messagingSenderId: "579190732334"
};
firebase.initializeApp(config);



var database = firebase.database();


//FUNCTIONS-------------------
//weather API AJAX call.
function weather() {
  //Need to change "Nashville" in the queryURL to the defined user input variable for city.  
  var weatherAPI = "8010786867558f69f90f520535222da2";
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
    "q=nashville&units=imperial&appid=" + weatherAPI;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
  });
}

$(document).ready(weather());{

}







//EVENT LISTENER FOR BUTTON--------------------
