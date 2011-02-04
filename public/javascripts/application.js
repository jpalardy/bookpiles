
function message(text) {
  $('#content').html('<div id="message">' + text + '</div>');
}

function loading(enabled) {
  enabled = enabled === undefined ? true : enabled;

  $('#loader').toggle(enabled);
}

function flash(text, level, duration) {
  if(!text) { return; }

  level = level || 'success'; // success, notice, error
  duration = duration || 5000;

  loading(false);

  $('#flash').removeClass().
              addClass(level).
              html(text).
              fadeIn('slow').
              delay(duration).
              fadeOut('slow');
}

function wait_for_backend() {
  loading();
  $(document).trigger('close.facebox');
}

// beginning of the rendering chain
var allBooks = new Pipe();

function show_book(isbn) {
  var book = $.grep(allBooks.input(), function(book) { return book.isbn == isbn; })[0];

  $.facebox($('#template_book_details').tmpl(book));
}

//############################################################

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
  wait_for_backend();
  $.post("/" + self._username + "/books", {"isbn": isbn, "status": status}, self._callback);
};

Backend.prototype.move_book = function(isbn, status) {
  var self = this;
  wait_for_backend();
  $.post("/" + self._username + "/books/" + isbn, {"_method": "put", "status": status}, self._callback);
};

Backend.prototype.delete_book = function(isbn) {
  var self = this;
  wait_for_backend();
  $.post("/" + self._username + "/books/" + isbn, {"_method": "delete"}, self._callback);
};

//############################################################

$(function() {
  $.facebox.settings.opacity = 0.6;

  // if there's a flash, remove it after 5 seconds
  setTimeout(function() { $('#flash').fadeOut('slow'); }, 5000);

  $('a[rel*=facebox]').facebox();

  $(document).bind('afterReveal.facebox', function() {
    $("#facebox input[type=text]:first").focus();
  });
});

