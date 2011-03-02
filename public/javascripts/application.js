
/*************************************************
 *
 * global view "helpers"
 *
 *************************************************/

function message(text) {
  $('#content').html('<div id="message">' + text + '</div>');
}

function flash(text, level, duration) {
  if(!text) { return; }

  level = level || 'success';   // success, notice, error
  duration = duration || 5000;

  $('#loader').hide();
  $('#flash').removeClass().
              addClass(level).
              html(text).
              fadeIn('slow').
              delay(duration).
              fadeOut('slow');
}

/*************************************************
 *
 * hook into the DOM
 *
 *************************************************/

$(function() {
  $.facebox.settings.opacity = 0.6;

  // if there's a flash, remove it after 5 seconds
  setTimeout(function() { $('#flash').fadeOut('slow'); }, 5000);

  $('a[rel*=facebox]').facebox();

  $(document).bind('afterReveal.facebox', function() {
    $("#facebox input[type=text]:first").focus();
  });
});

