
// allBooks -> queryFilter -> statusFilter -> bookPager -> DOM

var queryFilter = new Filter(function(book, criteria) {
  return book.title.match(criteria.re) || book.authors.match(criteria.re) || book.isbn.match(criteria.re);
});

var statusFilter = new Filter(function(book, criteria) {
  return book.status == criteria.status;
});

var bookPager = new Pager(5);

//############################################################

allBooks.onchange = function(books) {
  queryFilter.input(books);
};

queryFilter.onchange = function(books, criteria) {
  $('#amazon_search').attr('href', '/amazon/books' + (criteria.text ? "?q=" + criteria.text : ""));

  statusFilter.input(books);

  var counts = {"maybe": 0, "buy": 0, "ready": 0, "reading": 0, "stalled": 0, "done": 0};
  $.each(books, function(i, book) {
    counts[book.status] += 1;
  });

  $.each(counts, function(status, count) {
    $('.status_' + status + ' .count').text(count).toggle(count !== 0);
  });

  var current_status = statusFilter.criteria().status;
  var statuses_by_relevance = ["reading", "done", "stalled", "ready", "buy", "maybe"];
  statuses_by_relevance.unshift(current_status);

  var new_status = $.grep(statuses_by_relevance, function(status) { return counts[status] > 0; })[0];
  if(new_status && new_status != current_status) {
    set_status(new_status);
  }
};

function update_location_hash() {
  var lh = statusFilter.criteria().status;
  if(queryFilter.criteria().text) {
    lh = lh + "/" + queryFilter.criteria().text;
  }

  location.hash = lh;
}

statusFilter.onchange = function(books, criteria) {
  if(criteria.status) {
    update_location_hash();
  }

  $("#controls ul.statuses li").removeClass("selected");
  $("#controls ul.statuses li.status_" + criteria.status).addClass("selected");

  $('#content').empty();
  bookPager.input(books);
  fill();
};

//############################################################

function update_books() {
  $.getJSON('books.json', function(books) { allBooks.input(books); });
}

function set_status(status) {
  statusFilter.criteria({"status": status});
}

function set_query(text) {
  $(".search input").val(text);

  var re;
  try { re = new RegExp(text, 'i'); } catch(e) {}
  queryFilter.criteria({"text": text, "re": re});
}

//############################################################

function add_books(books, text) {
  if(books.length === 0) {
    message(text);
    return;
  }

  $('#template_book_block').tmpl(books).appendTo("#content");
}

var HEIGHTS = {"banner": 90, "row": 190};

function fill() {
  var rows = Math.ceil(($(window).height() - HEIGHTS.banner) / HEIGHTS.row);
  //rows = rows + 2; // try to get twice as many rows as would fit on the screen

  for(var i=0; i<rows; i++) {
    bookPager.next();
  }
}

function pull() {
  var cur_y = $(window).scrollTop() + $(window).height();
  var max_y = $(document).height();

  if(cur_y + HEIGHTS.row > max_y) {
    bookPager.next();
  }
}

//############################################################

$(function() {
  $('a.pile').live('click', function(e) {
    e.preventDefault();
    var status = e.target.hash.replace(/^#/, '');
    set_status(status);
  });

  var parts = location.hash.replace(/^#/, '').split('/');
  var status = parts[0] || "reading";
  var text   = unescape(parts[1] || "");

  set_status(status);
  set_query(text);

  bookPager.onchange = function(books) {
    add_books(books, 'no books in this pile');
  };

  $(window).scroll(pull);
});

