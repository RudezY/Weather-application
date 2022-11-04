$(document).ready(function() {

var today = moment();

$("#currentDay").text(today.format("[The date today is] dddd MMM Do, YYYY [and the time is] h:mm a"));
var city="";

var currentCity = $("#current-city");
var searchCity = $("#search-city");
var searchButton = $('#search-button');
var clearButton = $("#clear-history");
let currentHumidity= $("#humidity");
var currentTemperature = $("#temperature");
let currentWSpeed= $("#wind-speed");
var sCity =[];


function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}
// Display the current and future weather to the user after grabbing the city form the input text box.
function getWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}
// Here we create the AJAX call
function currentWeather(city){

      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`)
      .then((res) => res.json())
      .then(function(response){
        console.log(response)
        // parse the response to display the current weather including the City name. the Date and the weather icon. 
       
        //Dta object from server side Api for icon property.
        const weathericon= response.weather[0].icon;
        const iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        // The date format method is taken from the  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        const date=new Date(response.dt*1000).toLocaleDateString();
        //parse the response for name of city and concatenating the date and icon.
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");
        // parse the response to display the current temperature.

        const tempF = response.main.temp;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        // Display the Humidity
        $(currentHumidity).html(response.main.humidity+"%");
        //Display Wind speed and convert to MPH
        const ws=response.wind.speed;
        $(currentWSpeed).html(ws+"MPH");
        
        if(response.weather[0].main === "Clouds") {
            $("body").addClass("cloudy");
            $("body").removeClass("rain");
            $("body").removeClass("sunny");
            $("body").removeClass("snow");
        }else if(response.weather[0].main === "Rain") {
            $("body").addClass("rain");
            $("body").removeClass("cloudy");
            $("body").removeClass("sunny");
            $("body").removeClass("snow");
        }else if(response.weather[0].main === "Snow") {
            $("body").addClass("snow");
            $("body").removeClass("cloudy");
            $("body").removeClass("sunny");
            $("body").removeClass("rain");  
        }else if(response.weather[0].main === "Clear") {
            $("body").addClass("sunny");
            $("body").removeClass("cloudy");
            $("body").removeClass("snow");
            $("body").removeClass("rain");  
        }
        forecast(response.id);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });
}
 
// Here we display the 5 days forecast for the current city.
function forecast(cityid){
    const dayover= false;
     fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityid}&units=imperial&appid=${APIKey}`)
     .then((res) => res.json())
     
    .then(function(response){
       console.log(response) 
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            const tempF= response.list[((i+1)*8)-1].main.temp;
            var humidity= response.list[((i+1)*8)-1].main.humidity;
            var ws= response.list[((i+1)*8)-1].wind.speed;
        
            $("#fDate"+i).html(date);
            $("#fImg"+i).html("<img src="+iconurl+">");
            $("#fTemp"+i).html(tempF+"&#8457");
            $("#fHumidity"+i).html(humidity+"%");
            $('#fWind'+i).html(ws+"MPH")
        }

    
    
    
    
    });
}

// add the passed city on the search history
function addToList(c){
    const listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}
// display the past search again when the list group item is clicked in search history
function pastSearchHistory(event){
    const liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }

}

// render function
function loadLastCity(){
    $("ul").empty();
    const sCity = JSON.parse(localStorage.getItem("cityname"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }

}
//Clear the search history from the page
function clearHistory(event){
    event.preventDefault();
    sCity=[];
    localStorage.removeItem("cityname");
    document.location.reload();

}
//Click Handlers
$("#search-button").on("click",getWeather);
$(document).on("click",pastSearchHistory);
$(window).on("load",loadLastCity);
$("#clear-history").on("click",clearHistory);

});






























