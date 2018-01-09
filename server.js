// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var Promise = require("bluebird");

mongoose.Promise = Promise;

var port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

var routes = require("./controllers/controller.js");

app.use("/", routes);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/MongoNewsScraper" || "mongodb://heroku_63zn3nmz:6lvufagccno83d93trg9psfaqq@ds245357.mlab.com:45357/heroku_63zn3nmz");
var db = mongoose.connection;

db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

db.once("open", function() {
	console.log("Mongoose connection successful.");
});

app.listen(port, function() {
	console.log("App running on port!")
})