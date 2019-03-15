//GLOBAL VARIABLES-------------


var cty = "";   //holds the city the user searched
var stt = "";   //holds the state the user searched

var flg = false; //boolean flag for input validation
var flg2 = false;

var database = firebase.database(); //database refrence

// materialize datepicker
$(document).ready(function(){
  $('.datepicker').datepicker();
});
//FUNCTIONS-------------------

//weather API AJAX call.
function weather() {
   $("#weatherHolder > thead").empty();
   $("#weatherHolder > tbody").empty();
   if(cty === "New York City"){
      cty = "New York";

   }
  //Need to change "Nashville" in the queryURL to the defined user input variable for city.  
  var weatherAPI = "8010786867558f69f90f520535222da2";
  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?" +
    "q=" + cty + "&units=imperial&appid=" + weatherAPI;

    // $("#weatherHolder").empty();
    
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    console.log("Date:", response.list[10].dt_txt.substring(0,10));

    var headers = $("<tr>").append(
      $("<th>").text("Date"),
      $("<th>").text("Weather"),
      $("<th>").text("Temp"),
    )

    $("#weatherHolder > thead").append(headers);

    for (var j = 0; j < response.list.length; j = j + 8) {
      var date = response.list[j].dt_txt.substring(0,10);
      var description = response.list[j].weather[0].description;
      var temp = Math.floor(response.list[j].main.temp);

      var newDay = $("<tr>").append(
        $("<td>").text(date),
        $("<td>").text(description),
        $("<td>").text(temp)
      );
      $("#weatherHolder > tbody").append(newDay);
    }

  });
}

//ticketmaster api call

function ticketmaster() {

  $("#tEvents").empty();

  // console.log("MADE IT HERE!");
  var apiKey = "AGoGvNzEmLC1H1XIJtVipXmDeRDKMPQT";

  var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + cty + "&apikey=" + apiKey;


  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response._embedded.events);
    for (var i = 0; i < response._embedded.events.length; i++) {
      var name = response._embedded.events[i].name;
      var url = response._embedded.events[i].url;
      var img = response._embedded.events[i].images[0].url;

      console.log("IMG: " + img);
      $("#tEvents").append('<img src="' + img + '" alt="' + name + '" height="100" width="200"><br /><a target="_blank" href="' + url + '">' + name + '</a><br/>');

    }

  });

}

// function to get the Zomato city ID
function cityId() {
  var ctyId = "";
  // Ajax GET request to Zomato API URL passing the cty (city) variable
  $.ajax({
    method: "GET",
    crossDomain: true,
    url: "https://developers.zomato.com/api/v2.1/cities?q=" + cty,
    dataType: "json",
    async: true,
    headers: {
      "user-key": "0a661374a6b58eb2fa84142d27fe81ca"
    },
    success: function (data) {
      ctyId = data.location_suggestions[0].id;
      // calling the Zomato function with the city Id passed in
      zomato(ctyId);
    },
    error: function () {
      console.log("error!");
    }
  })
}
// function to get the Zomato restaurant details for the city that the user searched for
function zomato(ctyId) {
  $("#tFood").empty();
  // Ajax GET request to Zomato API URL passing the ctyId (city Id) variable
  var queryURL = {
    "collection_id": "1",
    "url": "https://developers.zomato.com/api/v2.1/search?&city_id=" + ctyId + "&count=10",
    "method": "GET",
    "headers": {
      "user-key": "fbf079a12e07d58c2e028ec67f02a6e1 ",
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  $.ajax(queryURL, function () {
  }).then(function (response) {
    var results = response;
    
    // loop to get 10 restaurants from the Zomato API
    for (var i = 0; i < results.restaurants.length; i++) {
      var restaurantPath = results.restaurants[i].restaurant;
      var name = restaurantPath.name;
      var cuisines = restaurantPath.cuisines;
      var $url = restaurantPath.menu_url;
      var img = restaurantPath.featured_image;
      console.log("IMG: " + img);

      if(img){
        console.log("In if img");
        var newRow = $("<div>").append(
          '<img src="' + img + '" height="100" width="200">',
          $("<div class='title'>").html('<a target="_blank" href="' + $url + '">' + name + "</a>"),
          $("<div class='cuisines'>").html("Cuisines: " + cuisines)
        );
      }
      else{
        var newRow = $("<div>").append(
          $("<div class='title'>").html('<a target="_blank" href="' + $url + '">' + name + "</a>"),
          $("<div class='cuisines'>").html("Cuisines: " + cuisines)
        );
      }
      // appending the restaurant name & their cuisine types

      // appending the restaurant details to the div #tFood
      $("#tFood").append(newRow);
    };
  });
}

//EVENT LISTENER FOR BUTTON--------------------

//click event to capture user input
$(".btn-floating").on("click", function () {

  if (flg) {
    //user entered bad query, reset page banner for next search
    $("#error").text("Spontaneity is a travel companion for spontaneous adventurers that want data-driven support for whimsical travel decision-making.  Enter a travel destination and a date range and Spontaneity will provide date-specific information on your potential destination.  This includes the weather forecast, local events, and excursions.");
    flg = false;
  }

  var $input = $("#icon_prefix").val().trim(); //get input

  //following two arrays for input validation
  var nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  var spclChars = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "[", "{", "]", "}", ":", ";", "<", ">", "?", '"', "'", ".", '/', "?", "|", "\\"];

  for (var i = 0; i < $input.length; i++) {
    //ensure there are no numbers in input, if so, ask for new input
    for (var j = 0; j < nums.length; j++) {
      if ($input[i] === nums[j]) {
        $("#error").text("Please try again without using any numbers or special characters besides a comma.");
        flg = true;
        return;
      }
    }
    //ensure there are no special characters in input, if so, ask for new input
    for (var k = 0; k < spclChars.length; k++) {
      if ($input[i] === spclChars[k]) {
        $("#error").text("Please try again without using any numbers or special characters besides a comma.");
        flg = true;
        return;
      }
    }
    //find the comma, and seperate the input into city and state vars
    if ($input[i] === ",") {
      var indx = i;
      cty = $input.substr(0, indx);
      stt = $input.substr(indx);
      stt = stt.slice(1);
      flg2 = true;
    }
  }
  if (!flg2) {
    console.log("HERE!");
    cty = $input;
  }

  database.ref().push({

    city: cty,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });


  cityId();
  ticketmaster();
  weather();
});

database.ref().limitToLast(5).on("child_added", function (childSnapshot) {

  $("#errorMsg").append(childSnapshot.val().city + ", ");

});






