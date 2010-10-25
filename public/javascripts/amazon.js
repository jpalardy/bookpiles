
// allBooks -> DOM

allBooks.onchange = function(books) {
  add_books(books, "no books found");
};

//############################################################

function search_amazon(query) {
  if(!query) {
    message("search to see results");
    return;
  }

  message('<img src="/images/ajax-loader.gif"/>');
  $.getJSON("/amazon/books.json", {"q": query}, function(books) { allBooks.input(books); });
}

//############################################################

$(function() {
  $("#controls .search input:first").focus();
});

