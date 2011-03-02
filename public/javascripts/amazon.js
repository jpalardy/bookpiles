
/*************************************************
 *
 * declare the models
 *
 * allBooks -> DOM
 *
 *************************************************/

models.allBooks.onchange = function(books) {
  add_books(books, "no books found");
  if(books.length === 0) {
    message("no books found");
    return;
  }

  $('#content').html($('#template_book_block').tmpl(books));
};

/*************************************************
 *
 * declare the controller
 *
 *************************************************/

var controller = {};

controller.search_amazon = function(query) {
  if(!query) {
    message("search to see results");
    return;
  }

  message('<img src="/images/ajax-loader.gif"/>');
  $.getJSON("/amazon/books.json", {"q": query}, function(books) { allBooks.input(books); });
};

/*************************************************
 *
 * hook into the DOM
 *
 *************************************************/

$(function() {
  // controller.search_amazon(#{ActiveSupport::JSON.encode(params[:q])});
  $("#controls .search input:first").focus();
});

