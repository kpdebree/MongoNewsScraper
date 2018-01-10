var cheerio = require("cheerio");
var request = require("request");

request("https://www.reddit.com/r/politics", function(error, response, html) {
		// Loads the HTML into cheerior and saves it into a variable
		var $ = cheerio.load(html);
		// empty array to store results
		var results = [];

		$(".title").each(function(i, element) {
			var title = $(element).text();
			var link = $(element).children().attr("href");

			results.push({
				title: title,
				link: link
			});
		});

		console.log(results)
});