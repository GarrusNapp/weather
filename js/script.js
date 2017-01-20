$(document).ready(function() {

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(locate, error);
  } else {
    error();
  }

  function locate(position){
    console.log("called");
    var lat = position.coords.latitude.toFixed(2);//
    var lon = position.coords.longitude.toFixed(2);//
    //$(".loc").append("<li>Latitude: "+ lat +"</li>");
    //$(".loc").append("<li>Longitude: "+ lon +"</li>");
    callAPI(lat,lon);
  }

  function error() {
    console.log("Couldn't find your location.");
  }


  function callAPI(x,y,city) {
    var key="5485b391b286983dc7b50452adcb9c23";

    if (city) {
      $.getJSON("https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid="+ key, function(json){
        console.log("OK");
        jsonGlobal = json;
        filler(json, false);
      });
    }
    else{
    $.getJSON("https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat="+ x +"&lon="+ y +"&appid="+ key, function(json){
      console.log("OK");
      jsonGlobal = json;
      filler(json, false);
    });
    }

  }

  function filler(data, imperial) {
    $("#weather").empty();
    $("#loc").empty();

    var temperature = data.main.temp - 273.15;
    var fahrenheit = temperature*9/5 + 32;
    var speed = data.wind.speed;
    var speedImperial = speed/0.44704
    var tempUnit = "C";
    var speedUnit = "m/s"

    if (imperial == true) {
      var temperature = fahrenheit;
      var tempUnit = "F";
      var speed = speedImperial.toFixed(2);
      var speedUnit = "MPH";
    }
    var time = new Date().getHours();
    if (time >= 6 && time <= 22) {
      var icon = "wi-owm-day-"+ data.weather[0].id;
    }
    else {
      var icon = "wi-owm-night-"+ data.weather[0].id;
    }
    var backgroundSelect = {"2": "storm", "3": "rain", "5": "rain", "6": "snowing"};
    var background = backgroundSelect[data.weather[0].id.toString()[0]];
    var currentWeather = data.weather[0].description;



    $("#loc").append("<li>Country: "+ data.sys.country +"</li>");
    $("#loc").append("<li>City: "+ data.name +"</li>");
    $("#weather").append("<li>Humidity: "+ data.main.humidity +" %</li>");
    $("#weather").append("<li>Pressure: "+ data.main.pressure +" hPa</li>");
    $("#weather").append("<li id=\"temp\">Temperature: "+ temperature.toFixed(2) +" &deg"+ tempUnit +"</li>");
    $("#weather").append("<li>Wind: "+ speed +" "+ speedUnit +"</li>");
    $("#icon").attr("class", "wi "+ icon);
    $("#weatherName").html(currentWeather);

    if(background) {
      $(".container").css("background-image", "url(./images/"+ background +".jpg)");
    }
    else {
      $(".container").css("background-image", "url(./images/clouds.jpg)");
    }

  }

  $("#selectCelsius").click(function(){
      filler(jsonGlobal, false);
      $(this).parent().addClass("active");
      $("#selectFahrenheit").parent().removeClass("active");

  });

  $("#selectFahrenheit").click(function(){
      filler(jsonGlobal, true);
      $(this).parent().addClass("active");
      $("#selectCelsius").parent().removeClass("active");

  });

  $("#newQuery").click(function(){
    console.log("NQCLICK");
    var query = $("#searchCity").val();
    if (query){
      callAPI(0,0,query);
    }
    $("#searchCity").val("");

  });

});