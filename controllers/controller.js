
// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var router = express.Router();

// ===============================================================================
// Models
// We need to include these models to format our data scrapes
// ===============================================================================
var Article = require("../models/article.js");
var Note = require("../models/note.js");


// ===============================================================================
// ROUTING
// We need to include these routes to connect our frontend to our back end
// ===============================================================================
router.get("/", function(req, res) {
	Article.find({saved : false}, function(error, doc) {
		// Displays errors
		if (error) {
			res.send(error);
		}

		else {
			var hbsObject = {
				"newsArticles": doc
			};
			res.render("index", hbsObject)
		}
	});
});

router.get("/article/notes", function(req, res) {
	Article.find({}).populate("note").exec(function(error, doc) {
		if (error) {
			res.send(error);
		}

		else {
			res.send(doc);
		}
	});
});


router.get("/save/articles", function(req, res) {
	Article.find({saved : true}).populate("note").exec(function(error, doc) {
		if(error) {
			res.send(error);
		}

		else {
			var hbsObject = {
				"newsArticles": doc,
				"notes": doc.notes
			};
			res.render("saved", hbsObject)
		}
	});
});



router.get("/scrape", function(req, res) {
	request("https://www.reddit.com/r/politics/", function(error, response, html) {
		// Loads the HTML into cheerior and saves it into a variable
		var $ = cheerio.load(html);
		// empty array to store results
		var results = {};

		$(".title").each(function(i, element) {
			var title = $(element).text();
			var link = $(element).children().attr("href");

	        results.title = $(this).children("a").text();
	        results.link = $(this).children("a").attr("href");

			var entry = new Article(results);

			entry.save(function(err, doc) {
				if (err) {
					console.log(err);
				}
				else {
					console.log(doc);
				}
			});
		});
	});
	res.redirect("/");
});

router.get("/notes", function(req, res) {
	Note.find({}, function(error, doc) {
		if (error) {
			res.send(error);
		}

		else {
			res.send(doc);
		}
	});
});


router.get("/articles", function(req, res) {
	Article.find({}, function(error, doc) {
		if (error) {
			res.send(error);
		}

		else {
			res.send(doc);
		}
	});
});

router.post("/save/articles/:id?", function(req, res) {
	Article.findOneAndUpdate({ "_id": req.params.id }, {"saved": true })
	.exec(function(err, doc) {
		if (err) {
			console.log(err);
		}
		else {
			res.redirect("/");
		}
	});
});

router.post("/remove/articles/:id?", function(req, res) {
	Article.findOneAndUpdate({ "_id": req.params.id }, {"saved": false })
	.exec(function(err, doc) {
		if (err) {
			console.log(err);
		}
		else {
			res.redirect("/save/articles");
		}
	});
});

router.post("/save/note/:id?", function(req, res) {
	// Create a new note and pass the req.body to the entry
	var newNote = new Note(req.body);
	console.log(req.body);

	newNote.save(function(error, doc) {
		if (error) {
			res.send(error);
		}

		else {
			// Find user and push the new note id into the User's notes array
			Article.findOneAndUpdate({"_id": req.params.id}, { $push: { "note": doc._id } }, { new: true}, function(err, newdoc) {
				if (err) {
					res.send(err);
				}

				else {
					res.redirect("/save/articles");
				}
			});
		}
	});
});


module.exports = router;