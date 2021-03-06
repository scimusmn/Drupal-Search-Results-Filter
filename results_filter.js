Drupal.behaviors.results_filterBehavior = function (context) {


  // create an array for class names
  var types = [];

  // set a variable to represent the search results
  var $results = $('dl.search-results div').not('#search-tools').not('#search-tools div');

  // loop through results divs and add their class names to the types array
  // TODO: let's be serious, this should probs be done with PHP before the results appear -
  // here, we're only getting content types of things on the first page. 
  $($results).each(function() {
    types.push(this.className);
  });
 
  // filter the array of classes down to just the unique ones
  var links = types.filter(function(itm, i, types) {
    return i == types.indexOf(itm);
  });
  
  // Build and output the filter links
  var options = '';
  $.each(links, function(index, value) {   
    var label = value.replace("_", " "); // convert underscores to spaces for the link text
    options += '<option value="'+ value +'">' + label + '</option>'; // markup for the filter options
  }); 
  $(options).appendTo('#types'); // put the options into the select list

  // Filter search results
  $('#types').change(function() {
    
    // hide content and show a preloader while the new search runs
    $($results).add('ul.pager').fadeOut('fast');   
    $('#search-tools').after('<div id="ajaxLoader">&nbsp;</div>').css("display", "block");
    
    $query = $('input#edit-keys').val(); // store the original query
    $adv_query = $(this).val(); // get the desired type by looking at the selected option

    $('input#edit-keys').val($query + ' type:' + $adv_query); // populate the search form with the adv query 
    $('#search-form').submit(); // submit the form with the new query
    $('#edit-submit').attr('disabled', 'disabled'); // disable the button while the results load

  });

  // check if the search has already been filtered
  // activate the reset link if that's true
  if ($('#reset').length) {
    $('#reset a').live('click', function() {    
      
      // Remove the type:* string from the advanced search
      $adv_query = $('input#edit-keys').val();
      query_regex = /.*type:/;
      orig_query_pre = String(query_regex.exec($adv_query));
      orig_query = orig_query_pre.replace("type:", "");

      // Populate the search box with the original search query
      $('input#edit-keys').val(orig_query); 
      
      // hide content and show a preloader while the new search runs
      $($results).add('ul.pager').fadeOut('fast');   
      $('#search-tools').after('<div id="ajaxLoader">&nbsp;</div>').css("display", "block"); 
            
      $('#search-form').submit(); // submit the form with the new query
      $('#edit-submit').attr('disabled', 'disabled'); // disable the button while the results load
    
      return false;

    });
  }

};
