const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const { secretKey } = require("./env.js")

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res){

  const query = req.body.cityName;
  const unit = "metric";
  const apiKey = secretKey.apiKey;

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
  https.get(url, function (response){
    console.log(response.statusCode);
    console.log(response.statusMessage);

    response.on("data", function (data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.set("content-type", "text/html");
      res.write("<h2>Weather is Currently " + weatherDescription + ".</h2>");
      res.write("<h1>The Temperature in " + query + " is " + temp + " Degree Celcius.</h1>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    });
  });
});

app.listen(3000, function (){
  console.log("Server is Running on port 3000.");
});
