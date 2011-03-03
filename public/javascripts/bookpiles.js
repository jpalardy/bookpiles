
/*************************************************
 *
 * declare the models
 *
 * allBooks -> ... (rest is defined in more specific page js)
 *
 *************************************************/

var models = {};

models.allBooks = new Pipe();

models.allBooks.find = function(isbn){
  return this._input.filter(function(book) {
    return book.isbn === isbn;
  })[0];
};

/*************************************************
 *
 * declare the controller
 *
 *************************************************/

var controller = {};

controller.show_book = function(isbn) {
  var book = models.allBooks.find(isbn);
  $.facebox($('#template_book_details').tmpl(book));
};

/*************************************************
 *
 * Backend -- instantiated by page's js
 *
 *************************************************/

function Backend(username, callback) {
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.init(username, callback);
}

Backend.prototype.init = function(username, callback) {
  var self = this;
  self._username = username;
  self._callback = callback;
};

Backend.prototype.add_book = function(isbn, status) {
  var self = this;
  self.loading(true);
  $.post("/" + self._username + "/books", {"isbn": isbn, "status": status}, self._callback);
};

Backend.prototype.move_book = function(isbn, status) {
  var self = this;
  self.loading(true);
  $.post("/" + self._username + "/books/" + isbn, {"_method": "put", "status": status}, self._callback);
};

Backend.prototype.delete_book = function(isbn) {
  var self = this;
  self.loading(true);
  $.post("/" + self._username + "/books/" + isbn, {"_method": "delete"}, self._callback);
};

Backend.prototype.loading = function(loading) {
  $('#loader').toggle(loading);
  $(document).trigger('close.facebox');
};

Backend.prototype.loaded = function(message) {
  var self = this;
  self.loading(false);
  flash(message.text, message.level);
  self._callback();
};

var backend = new Backend();

/*************************************************
 *
 * hook into the DOM
 *
 *************************************************/

$(function() {
  $('#content').delegate('img.book_cover', 'click', function(e) {
    var isbn = e.target.alt;
    controller.show_book(isbn);
  });
});

