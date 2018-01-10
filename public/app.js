$(document).on("click", ".save", function() {
  // Empty the notes from the note section

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  //console.log(thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/save/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
    location.reload();
    });
});


$(document).on("click", ".remove", function() {
  // Empty the notes from the note section

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  //console.log(thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/remove/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
    location.reload();
    });
});



$(document).on("click", ".saveNote", function() {
  // Empty the notes from the note section
  var notesObj = {
    title: $("#title").val().trim(),
    body: $("#notes").val().trim()
  }
  console.log(notesObj);
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/save/note/" + thisId,
    data: notesObj

  })
    // With that done, add the note information to the page
    .done(function(data) {
    location.reload();
    });
});

$(document).on("click", ".deleteNote", function() {
  // Empty the notes from the note section

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  //console.log(thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/delete/note/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      location.reload();
    });
});