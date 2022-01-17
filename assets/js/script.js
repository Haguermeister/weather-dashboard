var loc = {
    name: "",
    lat: "",
    lon: ""
};

var weatherHolder = JSON.parse(localStorage.getItem("weatherHolder"));
if (weatherHolder) {
    for (var i = 0; i < weatherHolder.length; i++) {
        weather = weatherHolder[i];
        addButton(weather.name);
    }
    $(".test").css({ backgroundColor: "#6c757d", color: "#343a40" });
}
else {
    weatherHolder = [];

}
var locationHolder = [];
var apiKey = "93f91f184c42cedf902c70f59d36a8ac";
var apiUrl = "";
var temp;

function checkLocation() {
    var apiLocation = "https://api.openweathermap.org/geo/1.0/direct?q=" + loc.name + "&appid=" + apiKey;
    fetch(apiLocation).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                if (data.length > 0) {
                    loc.lat = data[0].lat;
                    loc.lon = data[0].lon;
                    apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + loc.lat + "&lon=" + loc.lon + "&exclude=hourly,minutely&appid=" + apiKey;
                    checkWeather();
                }
                else {
                    console.log("Test")
                    $("#weatherInfo").text("Error: City can not be found.").css("color", "red");
                }
            });
        }

    });
}
function checkWeather() {
    var check = !weatherHolder.some((city) => city.name === loc.name);
    if (check) {
        fetch(apiUrl).then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    var weather = data;
                    var weatherHolderVar = {
                        name: loc.name,
                        lat: weather.lat,
                        lon: weather.lon,
                        current: weather.current,
                        daily: weather.daily
                    };
                    locationHolder.push(weatherHolderVar.name);
                    weatherHolder.push(weatherHolderVar);
                    localStorage.setItem("weatherHolder", JSON.stringify(weatherHolder));
                    $(".test").css({ backgroundColor: "#6c757d", color: "#343a40" });
                    addButton(loc.name);
                    displayWeather(weather);
                });
            }
        });
    }
    else {
        const ref = weatherHolder.findIndex((city) => city.name === loc.name);
        weather = weatherHolder[ref];
        $(".test").css({ backgroundColor: "#6c757d", color: "#343a40" });
        $('button:contains(' + loc.name + ')').css({ backgroundColor: "#007bff", color: "white" });
        displayWeather(weather);
    }
}
function displayWeather(weather) {
    var parent = document.getElementById("weatherInfo");
    removeAllChildNodes(parent);
    $("#weatherInfo").css("color", "black");

    tempDisp = tempConv(weather.current.temp);
    dateDisp = dateConv(weather.current.dt);
    var iconurl = "https://openweathermap.org/img/w/" + weather.current.weather[0].icon + ".png";
    $("#weatherInfo").append([
        $("<div>", { "class": "border border-dark mt-1" }).append([
            $("<h2>").text(loc.name + ' ' + dateDisp).append(
                $("<img>", { "src": iconurl }))
            ,
            $("<p>").text("Temp: " + tempDisp + " F"),
            $("<p>").text("Wind: " + weather.current.wind_speed + " MPH"),
            $("<p>").text("Humidity: " + weather.current.humidity + " %"),
            $("<p>").text("U/V Index: ").append($("<span>", { "id": "uvSpan" }).text(weather.current.uvi))
        ]), $("<div>", { "id": "forecastHeader" }).text("5 Day Forecast").append(
            $("<div>", { "class": " dayContainer d-flex" })
        )]
    );
    var spanColorVals = spanColor(weather.current.uvi);
    $("#uvSpan").css("background-color", spanColorVals[0]);
    $("#uvSpan").css("color", spanColorVals[1]);
    for (var i = 1; i < 6; i++) {
        var iconurl = "https://openweathermap.org/img/w/" + weather.daily[i].weather[0].icon + ".png";
        tempDisp = tempConv(weather.daily[i].temp.day);
        dateDisp = dateConv(weather.daily[i].dt)
        $(".dayContainer").append(
            $("<div>", { "class": "bg-dark text-white col m-1" }).append([
                $("<p>").text(dateDisp),
                $("<img>", { "src": iconurl }),
                $("<p>").text("Temp: " + tempDisp + " F"),
                $("<p>").text("Wind: " + weather.daily[i].wind_speed + " MPH"),
                $("<p>").text("Humidity: " + weather.daily[i].humidity + " %")
            ])
        );
    }
}
function tempConv(temp) {
    var tempF = (((temp - 273.15) * (9 / 5)) + 32);
    tempF = tempF.toFixed(2);
    return tempF;
}
function addButton(name) {
    $("#citySearch").append($("<button>", { "class": "btn btn-primary mt-3 test" }).text(name).css('color', "white"));
}
function dateConv(utcDate) {
    var dateObj = new Date((utcDate * 1000));
    var dateDisp = dateObj.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit' })
    return dateDisp;
}
function removeAllChildNodes(parent) { // https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
function spanColor(uvi) {
    if (uvi <= 2) {
        var colors = ["green"];
        colors.push("white");
    }
    else if (uvi <= 5 & uvi > 2) {
        colors = ["yellow"];
        colors.push("black");
    }
    else {
        colors = ["red"];
        colors.push("white");
    }
    return colors;
}
$("form").submit(function (e) {
    e.preventDefault();
    loc.name = $("#searchBar").val();
    $("#searchBar").val('');
    loc.name = loc.name.charAt(0).toUpperCase() + loc.name.slice(1).toLowerCase();
    checkLocation();
});

$(document).on('click', '.test', function (e) {
    loc.name = e.target.innerText;
    const ref = weatherHolder.findIndex((city) => city.name === loc.name);
    weather = weatherHolder[ref];
    displayWeather(weather);
    $(".test").css({ backgroundColor: "#6c757d", color: "#343a40" });
    $(e.target).css({ backgroundColor: "#007bff", color: "white" });
    checkLocation();
});
/* $(document).on("click", ".buttonC", function () {
    console.log("Kelsey poops");

}) */
// function that takes city name looks at local storage for city name
// then if not call api