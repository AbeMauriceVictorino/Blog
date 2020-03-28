//jshint esversion:6
//best to view in a different tab

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const https = require("https");

//starting contents from Udemy
const homeStartingContent = "Hello bloggers my name is Abe and welcome to my blog. This blog will consist of my every day life and my journey of getting my ABIT degree. I will also talk about my move to Las Vegas";
const aboutContent = "Hello My name is Abe Victorino, I am 22 years of age. I am born and raised on the island of Molokai for all my life, Untill I made a change that will change my life. Me and my family have decided it was time for a change and we decided to move to Las Vegas. Follow me in my journey a new life. The city that never sleeps.";
const contactContent = "If you want to know more about me or are interested in contacting me, use my business email.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//not necessary but this is a function that can truncate text
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



//global variable array for posts
let posts = [];

//getting the home page
app.get("/",function(req, res){
  res.render("home",
    {homeStarting:homeStartingContent,
    posts:posts
  });
});


//getting the about page
app.get("/about",function(req, res){
  res.render("about", {about:aboutContent});

});


//getting the contact page
app.get("/contact",function(req, res){
  res.render("contact", {contact:contactContent});
});


//getting the compose page
app.get("/compose",function(req,res){
  res.render("compose");
});


//express routing for posts
app.get("/posts/:postName", function(req,res){
  const requestTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);


  if(storedTitle == requestTitle){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  }
  });


});


//posting the compose posts
app.post("/compose", function(req,res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  posts.push(post);
  res.redirect("/");
});



//global array for weathers and inputs will be pushed in here
let weathers = [];

//getting the weather page
app.get("/weather", function(req,res){
  res.render("weather", {
    weathers:weathers
  });
});

//posting the weather inputs
app.post("/weather", function(req,res){
//weathers array will be cleared everytime a post is made
weathers = [];
      const city = req.body.city;
      const units = "imperial";
      const apiKey = "67f6b382921c1e89b39b20d4f9556f22"; //Abe's API Key
      const url = "https://api.openweathermap.org/data/2.5/weather?APPID=" + apiKey + "&q=" +city+ "&units=" + units;
      console.log(city);


      https.get(url, function(response){

          // gets individual items from Open Weather API
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

            //object that will be pushed back to weathers array and to weather.ejs
              const weather = {
                city: city,
                image: imageURL,
                temp: Math.round(temp),
                weatherDescription: weatherDescription,
                humidity: humidity,
                windDirection: windDirection
              };
              weathers.push(weather);
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