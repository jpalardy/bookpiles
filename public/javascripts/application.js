
var html = {
  book_block: '<table class="book_block">\
                 <tr>\
                   <td>\
                     <img class="book_cover" alt="$ISBN" src="$SRC" title="$TITLE" onclick="show_book(this.alt)"/>\
                   </td>\
                 </tr>\
               </table>',
  book_details: '<table id="book_details">\
                   <tr>\
                     <td class="cell">\
                       <img class="book_cover" src="$SRC" title="$TITLE"/>\
                     </td>\
                     <td class="cell full">\
                       <table class="details">\
                         <tr><td>Title:</td><td class="full">$TITLE</td></tr>\
                         <tr><td>Authors:</td><td>$AUTHORS</td></tr>\
                         <tr><td>Published:</td><td>$PUBLISHED</td></tr>\
                         <tr><td>Pages:</td><td>$PAGES</td></tr>\
                         <tr><td>ISBN:</td><td>$ISBN</td></tr>\
                       </table>\
                     </td>\
                   </tr>\
                 </table>',
  book_actions: '<ul>\
                   <li><a href="http://www.amazon.com/gp/product/$ISBN">View on amazon.com</a></li>\
                 </ul>',
  move_book_actions: '<ul>\
                        <li><a href="http://www.amazon.com/gp/product/$ISBN">View on amazon.com</a></li>\
                        <li>Move to:\
                          <ul class="statuses">\
                            <li>\
                              <a href="#maybe" onclick="backend.move_book(\'$ISBN\', \'maybe\'); return false">maybe</a>\
                            </li>\
                            <li>\
                              <a href="#buy" onclick="backend.move_book(\'$ISBN\', \'buy\'); return false">buy</a>\
                            </li>\
                            <li>\
                              <a href="#ready" onclick="backend.move_book(\'$ISBN\', \'ready\'); return false">ready</a>\
                            </li>\
                            <li>\
                              <a href="#reading" onclick="backend.move_book(\'$ISBN\', \'reading\'); return false">reading</a>\
                            </li>\
                            <li>\
                              <a href="#stalled" onclick="backend.move_book(\'$ISBN\', \'stalled\'); return false">stalled</a>\
                            </li>\
                            <li>\
                              <a href="#done" onclick="backend.move_book(\'$ISBN\', \'done\'); return false">done</a>\
                            </li>\
                          </ul>\
                        </li>\
                        <li><a href="#" onclick="if(confirm(\'delete book?\')) { backend.delete_book(\'$ISBN\') }; return false">Delete</a></li>\
                      </ul>',
  add_book_actions: '<ul>\
                       <li><a href="http://www.amazon.com/gp/product/$ISBN">View on amazon.com</a></li>\
                       <li>Add to:\
                         <ul class="statuses">\
                           <li>\
                             <a href="#maybe" onclick="backend.add_book(\'$ISBN\', \'maybe\'); return false">maybe</a>\
                           </li>\
                           <li>\
                             <a href="#buy" onclick="backend.add_book(\'$ISBN\', \'buy\'); return false">buy</a>\
                           </li>\
                           <li>\
                             <a href="#ready" onclick="backend.add_book(\'$ISBN\', \'ready\'); return false">ready</a>\
                           </li>\
                           <li>\
                             <a href="#reading" onclick="backend.add_book(\'$ISBN\', \'reading\'); return false">reading</a>\
                           </li>\
                           <li>\
                             <a href="#stalled" onclick="backend.add_book(\'$ISBN\', \'stalled\'); return false">stalled</a>\
                           </li>\
                           <li>\
                             <a href="#done" onclick="backend.add_book(\'$ISBN\', \'done\'); return false">done</a>\
                           </li>\
                         </ul>\
                       </li>\
                     </ul>'
};

//############################################################

function message(text) {
  $('#content').html('<div id="message">' + text + '</div>');
}

function flash(text, level, duration) {
  if(!text) { return; }

  level = level || 'success'; // success, notice, error
  duration = duration || 3000;

  $('#flash').removeClass().
              addClass(level).
              html(text).
              fadeIn('slow').
              delay(duration).
              fadeOut('slow');
}

function add_books(books, text) {
  if(books.length === 0) {
    message(text);
    return;
  }

  var dst = $('#content').html('');
  $.each(books, function(i, book) {
    dst.append(html.book_block.replace(/\$ISBN/, book.isbn).replace(/\$SRC/, book.image_url).replace(/\$TITLE/, book.title));
  });
}

// beginning of the rendering chain
var allBooks = new Pipe();

function show_book(isbn) {
  var book = $.grep(allBooks.input(), function(book) { return book.isbn == isbn; })[0];

  var out_html = html.book_details + html.book_actions;

  $.facebox(out_html.replace(/\$SRC/g, book.image_url).
                     replace(/\$TITLE/g, book.title).
                     replace(/\$AUTHORS/g, book.authors).
                     replace(/\$PAGES/g, book.pages).
                     replace(/\$PUBLISHED/g, book.published_on).
                     replace(/\$ISBN/g, book.isbn));
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
  $(document).trigger('close.facebox');
  $.post("/" + self._username + "/books", {"isbn": isbn, "status": status}, self._callback);
};

Backend.prototype.move_book = function(isbn, status) {
  var self = this;
  $(document).trigger('close.facebox');
  $.post("/" + self._username + "/books/" + isbn, {"_method": "put", "status": status}, self._callback);
};

Backend.prototype.delete_book = function(isbn) {
  var self = this;
  $(document).trigger('close.facebox');
  $.post("/" + self._username + "/books/" + isbn, {"_method": "delete"}, self._callback);
};

//############################################################

$(function() {
  $.facebox.settings.opacity = 0.6;
  $(document).bind('keypress', {combi:'/', disableInInput: true}, function() { $('#controls .search input').focus(); return false; });

  // if there's a flash, remove it after 5 seconds
  setTimeout(function() { $('#flash').fadeOut('slow'); }, 5000);

  $('a[rel*=facebox]').facebox();

  $(document).bind('afterReveal.facebox', function() {
    $("#facebox input[type=text]:first").focus();
  });
});

