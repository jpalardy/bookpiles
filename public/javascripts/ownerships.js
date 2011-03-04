
/*************************************************
 *
 * declare the models
 *
 * allBooks -> queryFilter -> statusFilter -> bookPager -> DOM
 *
 *************************************************/

models.allBooks.onchange = function(books) {
  models.queryFilter.input(books);
};

//*************************************************

models.queryFilter = new Filter(function(book, criteria) {
  return book.title.match(criteria.re) || book.authors.match(criteria.re) || book.isbn.match(criteria.re);
});

models.queryFilter.onchange = function(books, criteria) {
  $('#amazon_search').attr('href', '/amazon/books' + (criteria.text ? "?q=" + criteria.text : ""));

  models.statusFilter.input(books);

  var counts = {"maybe": 0, "buy": 0, "ready": 0, "reading": 0, "stalled": 0, "done": 0};
  $.each(books, function(i, book) {
    counts[book.status] += 1;
  });

  $.each(counts, function(status, count) {
    $('.status_' + status + ' .count').text(count).toggle(count !== 0);
  });

  var current_status = models.statusFilter.criteria().status;
  var statuses_by_relevance = ["reading", "done", "stalled", "ready", "buy", "maybe"];
  statuses_by_relevance.unshift(current_status);

  var new_status = $.grep(statuses_by_relevance, function(status) { return counts[status] > 0; })[0];
  if(new_status && new_status !== current_status) {
    models.statusFilter.status(new_status);
  }
};

//*************************************************

models.statusFilter = new Filter(function(book, criteria) {
  return book.status === criteria.status;
});

models.statusFilter.status = function(status) {
  this.criteria({"status": status});
};

models.statusFilter.onchange = function(books, criteria) {
  if(criteria.status) {
    var text = models.queryFilter.criteria().text;

    if(text) {
      location.hash = criteria.status + "/" + text;
    } else {
      location.hash = criteria.status;
    }
  }

  $("#controls ul.statuses li").removeClass("selected");
  $("#controls ul.statuses li.status_" + criteria.status).addClass("selected");

  $('#content').empty();
  models.bookPager.input(books);
};

//*************************************************

var HEIGHTS = {"banner": 90, "row": 190};

models.bookPager = new Pager(5);

models.bookPager.input = (function() {
  var old_input = models.bookPager.input;
  return function(books) {
    old_input.call(models.bookPager, books);
    this.fill();
  };
}());

models.bookPager.fill = function() {
  var rows = Math.ceil(($(window).height() - HEIGHTS.banner) / HEIGHTS.row);

  var i;
  for(i=0; i<rows; i++) {
    this.next();
  }
};

models.bookPager.pull = function() {
  var cur_y = $(window).scrollTop() + $(window).height();
  var max_y = $(document).height();

  if(cur_y + HEIGHTS.row > max_y) {
    this.next();
  }
};

/*************************************************
 *
 * extend the controller
 *
 *************************************************/

controller.update_books = function() {
  $.getJSON('books.json', function(books) { models.allBooks.input(books); });
};

controller.set_status = function(status) {
  models.statusFilter.status(status);
};

controller.set_query = function(text) {
  // don't set again if the same -- useful on empty
  if(models.queryFilter.criteria().text === text) {
    return;
  }

  $(".search input").val(text);

  var re;
  try { re = new RegExp(text, 'i'); } catch(e) {}
  models.queryFilter.criteria({"text": text, "re": re});
};

/*************************************************
 *
 * hook into the DOM
 *
 *************************************************/

$(function() {
  var parts = location.hash.replace(/^#/, '').split('/');
  var status = parts[0] || "reading";
  var text   = unescape(parts[1] || "");

  controller.set_status(status);
  controller.set_query(text);

  models.bookPager.onchange = function(books) {
    if(books.length === 0) {
      message('no books in this pile');
      return;
    }

    $('#template_book_block').tmpl(books).appendTo("#content");
  };

  controller.update_books();

  $('a.pile').live('click', function(e) {
    if(location.pathname === e.target.pathname) {
      e.preventDefault();
      var status = e.target.hash.replace(/^#/, '');
      controller.set_status(status);
    }
  });

  $('#controls .search input:first').change(function() {
    controller.set_query(this.value);
  }).click(function() {
    controller.set_query(this.value);
  });

  $(window).scroll(function() { models.bookPager.pull(); });
});

