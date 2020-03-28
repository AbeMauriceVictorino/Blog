//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "";
const aboutContent = "";
const contactContent = "";
const weatherContent = "";

weather
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
text_truncate = function(str, length, ending) {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = '...';
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  };


let posts = [];

app.get("/", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});
app.get("/weather", function(req, res){
  res.render("weather", {weatherContent: weatherContent});
});
app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});
app.post("/compose", function(req,res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  posts.push(post);
  res.redirect("/");
});
let weather = [];
app.get("/weather", function(req,res){
  res.render("weather", {
    weather:weather
  });
});

app.post("/weather", function(req,res){
  weather = [];
      const city = req.body.city;
      const units = "imperial";
      const apiKey = "67f6b382921c1e89b39b20d4f9556f22"; 
      const url = "https://api.openweathermap.org/data/2.5/weather?APPID=" + apiKey + "&q=" +city+ "&units=" + units;
      console.log(city);
http.get(url, function(response){

 response.on("data", function(data){
              const weatherData = JSON.parse(data);
              const minTemp = weatherData.main.temp_min;
              const maxTemp = weatherData.main.temp_max;
              const lat = weatherData.coord.lat;
              const lon = weatherData.coord.lon;
              const temp = weatherData.main.temp;
              const city = weatherData.name;
              const humidity = weatherData.main.humidity;
              const windSpeed = weatherData.wind.speed;
              const windDirection = weatherData.wind.deg;
              const weatherDescription = weatherData.weather[0].description;
              const icon = weatherData.weather[0].icon;
              const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

              const weather = {
                city: city,
                image: imageURL,
                temp: Math.round(temp),
                weatherDescription: weatherDescription,
                humidity: humidity,
                windDirection: windDirection
              };
              weather.push(weather);
              res.redirect("/weather");


// displays the output of the results

              //res.write("<h1 class=weather> The weather is " + weatherDescription + "<h1>");

              //res.write("<h1> The minimum temperature is " + minTemp + " degrees Farenheit. The maximum temperature is " + maxTemp + " degrees Farenheit. </h1>" );

              //res.write("<h1> The wind speed is " + windSpeed + " mph at " + windDirection + " degrees. </h1>" );

              //res.write("<h2>The Temperature in " + city + " is " + temp + " Degrees Fahrenheit<h2>");

              //res.write("Humidity is " + humidity + "% with wind speed of " + windSpeed+  " miles/hour");
              //res.write("<img src=" + imageURL +">");
              //res.send();
          });

});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
