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




//$(document).ready(ticketmaster());{

//}






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
  



       ticketmaster();
});

database.ref().on("child_added", function(childSnapshot) {

  $("#errorMsg").append(childSnapshot.val().city + " ");

});




