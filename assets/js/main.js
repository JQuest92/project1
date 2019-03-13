//GLOBAL VARIABLES-------------


var cty = "";   //holds the city the user searched
var stt = "";   //holds the state the user searched

var flg = false; //boolean flag for input validation
var flg2 = false;

var database = firebase.database(); //database refrence


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

//ticketmaster api call

function ticketmaster() {

  $("#tEvents").empty();

  console.log("MADE IT HERE!");
  var apiKey = "AGoGvNzEmLC1H1XIJtVipXmDeRDKMPQT";

  var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + cty + "&apikey=" + apiKey;


  $.ajax({
    url: queryURL,
    method: "GET"}).then(function(response) {
        console.log(response._embedded.events);
        for(var i = 0; i < response._embedded.events.length; i++)
        {
            var name = response._embedded.events[i].name;
            var url = response._embedded.events[i].url;

            $("#tEvents").append('<a target="_blank" href="' + url + '">' + name + "</a><br/>");

        }

  });

}

// function to get the Zomato city ID
function cityId() {
  var ctyId  = "";
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
    success: function(data) {
      ctyId = data.location_suggestions[0].id;
      // calling the Zomato function with the city Id passed in
      zomato(ctyId);
    }, 
    error: function() {
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
  $.ajax(queryURL, function() {
  }).then(function(response) {

    var results = response;
    // loop to get 10 restaurants from the Zomato API
    for (var i = 0; i < results.restaurants.length; i++) {
      var restaurantPath = results.restaurants[i].restaurant;
        var name = restaurantPath.name;
        var cuisines = restaurantPath.cuisines;
        var url = restaurantPath.menu_url;
        // appending the restaurant name & their cuisine types
        var newRow = $("<div>").append(
          $("<div class='title'>").html('<a target="_blank" href="' + url + '">' + name + "</a>"),
          $("<div class='cuisines'>").html("Cuisines: " + cuisines)
        );
      // appending the restaurant details to the div #tFood
      $("#tFood").append(newRow);
    };
  });
}

//EVENT LISTENER FOR BUTTON--------------------

//click event to capture user input
$(".btn-floating").on("click", function(){

  if(flg)
  {
    //user entered bad query, reset page banner for next search
    $("#errorMsg").text("Spontaneity is a travel companion for spontaneous adventurers that want data-driven support for whimsical travel decision-making.  Enter a travel destination and a date range and Spontaneity will provide date-specific information on your potential destination.  This includes the weather forecast, local events, and excursions.");
    flg = false;
  }

  var $input = $("#icon_prefix").val().trim(); //get input

  //following two arrays for input validation
  var nums = ["1","2","3","4","5","6","7","8","9","0"];
  var spclChars = [ "!", "@", "#","$","%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "[", "{", "]", "}", ":", ";", "<", ">", "?", '"', "'", ".", '/', "?", "|", "\\"];

  for(var i = 0; i < $input.length; i++)
  {
        //ensure there are no numbers in input, if so, ask for new input
        for(var j = 0; j < nums.length; j++) 
        {
          if($input[i] === nums[j])
          {
              $("#errorMsg").text("Please try again without using any numbers or special characters besides a comma.");
              flg = true;
              return;
          }
        }
        //ensure there are no special characters in input, if so, ask for new input
        for(var k = 0; k < spclChars.length; k++)
        {
          if($input[i] === spclChars[k])
          {
              $("#errorMsg").text("Please try again without using any numbers or special characters besides a comma.");
              flg = true;
              return;
          }
        }
        //find the comma, and seperate the input into city and state vars
        if($input[i] === ",")
        {
            var indx = i;
            cty = $input.substr(0,indx);
            stt = $input.substr(indx);
            stt = stt.slice(1);
            flg2 = true;
        }
  }
        if(!flg2)
        {
            cty = $input;
        }

        database.ref().push({

          city: cty,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
  


       cityId();      
       ticketmaster();
});

database.ref().on("child_added", function(childSnapshot) {

  $("#errorMsg").append(childSnapshot.val().city + " ");

});




