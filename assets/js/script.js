var loc = {
    name: "",
    lat: "",
    lon: "",
    ref: 0
};
var apiKey = "93f91f184c42cedf902c70f59d36a8ac";
var apiUrl = "";

function checkLocation() {
    var apiLocation = "http://api.openweathermap.org/geo/1.0/direct?q=" + loc.name + "&appid=" + apiKey;
    fetch(apiLocation).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                loc.lat = data[0].lat;
                loc.lon = data[0].lon;
                apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + loc.lat + "&lon=" + loc.lon + "&exclude=hourly,minutely&appid=" + apiKey;
                checkWeather();
            });
        }
    });
}
function checkWeather() {
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var weather = data;

            });
        }
    });
}
function displayWeather(weather) {
    console.log(weather);
    var temp = (((weather.current.temp - 273.15) * (9 / 5)) + 32);
    temp = temp.toFixed(2);
    var dateObj = new Date((weather.current.dt * 1000));
    var dateDisp = dateObj.toLocaleString([], { weekday: 'long', month: 'long', day: '2-digit', year: "numeric" })
    var iconurl = "http://openweathermap.org/img/w/" + weather.current.weather[0].icon + ".png";
    $("#weatherInfo").append([
        $("<div>", { "class": "border border-dark mt-1" }).append([
            $("<h2>").text(loc.name + ' ' + dateDisp).append(
                $("<img>", { "src": iconurl }))
            ,
            $("<p>").text("Temp: " + temp + " F"),
            $("<p>").text("Wind: " + weather.current.wind_speed + " MPH"),
            $("<p>").text("Humidity: " + weather.current.humidity + " %"),
            $("<p>").text("U/V Index: " + weather.current.uvi)
        ]), $("<div>", { "id": "forecastHeader" }).text("5 Day Forecast").append(
            $("<div>", { "class": " dayContainer d-flex" })
        )]
    );
    for (var i = 0; i < 5; i++) {
        $(".dayContainer").append(
            $("<div>", { "class": "bg-dark text-white col m-1" }).append([
                $("<p>").text("Date"),
                $("<p>").text("Icon"),
                $("<p>").text("Temp: " + " F"),
                $("<p>").text("Wind: " + " MPH"),
                $("<p>").text("Humidity: " + " %")
            ])
        );
    }
}
$("form").submit(function (e) {
    e.preventDefault();
    loc.name = $("#searchBar").val();
    loc.name = loc.name.charAt(0).toUpperCase() + loc.name.slice(1).toLowerCase();
    checkLocation();
});
// function that takes city name looks at local storage for city name
// then if not call api