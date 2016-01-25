(function() {
  var $searchInput = $('#search-input');
  var $repoList = $('.repo-list');

  function renderPage(response) {
    var repos = _.chain(response.data)
      .filter(function(r) { return !r.fork; })
      .sort(function(r1, r2) {
        return new Date(r2.pushed_at).getTime() -
          new Date(r1.pushed_at).getTime();
      })
      .value();
    var $listEl = $('<ul></ul>');
    var templateFn = _.template($('#repo-template').text().trim());
    _.each(repos, function(repo) {
      $listEl.append($(templateFn(repo)));
    });
    $repoList.append($listEl);
    updateSearch($searchInput.val());
  }

  Mousetrap.bind('/', function() {
    _.defer(function() {
      $searchInput.focus();
    });
  });

  Mousetrap.bind('esc', function() {
    $searchInput.val('');
    updateSearch('');
  });

  function updateSearch(text) {
    var $repoEls = $repoList.find('li');
    $repoEls.removeClass('highlight');
    var repoEls = $repoEls.toArray();
    var matchFn = function(el) {
      return $(el).data('reponame').indexOf(text) >= 0;
    };
    var matchingEls = _.filter(repoEls, matchFn);
    var nonMatchingEls = _.filter(repoEls, _.negate(matchFn));
    $(matchingEls).removeClass('hidden');
    $(nonMatchingEls).addClass('hidden');
    if (text) {
      $(matchingEls).first().addClass('highlight');
    }
  }

  function moveHighlight(n) {
    var $visibleItems = $repoList.find('li').filter(':not(.hidden)');
    var visibleItems = $visibleItems.toArray();
    var highlightedIndex = _.findIndex(visibleItems, function(el) { return $(el).hasClass('highlight'); });
    var newIndex = Math.max(0, Math.min(highlightedIndex + n, visibleItems.length - 1));
    if (newIndex !== highlightedIndex) {
      $visibleItems.removeClass('highlight');
      $(visibleItems[newIndex]).addClass('highlight');
    }
  }

  $searchInput.keydown(function(e) {
    // Prevent up arrow from moving the cursor to the beginning of the input field 
    if (e.which === 38 || e.which === 40) {
      e.preventDefault();
    }
  });

  $searchInput.keyup(function(e) {
    if (e.which === 13) { // Enter
      var $highlighted = $repoList.find('li.highlight');
      if ($highlighted.length) {
        $highlighted.find('.repo-name a').click();
      }
    } else if (e.which === 38) { // Up arrow
      moveHighlight(-1);
    } else if (e.which === 40) { // Down arrow
      moveHighlight(1);
    } else if (e.which === 27) { // Escape
      if ($searchInput.is(':focus')) {
        $searchInput.val('');
        $searchInput.blur();
        updateSearch('');
      }
    } else {
      updateSearch($searchInput.val());
    }
  });

  $.ajax({
    url: 'https://api.github.com/users/wcauchois/repos',
    dataType: 'jsonp',
    crossDomain: true,
    jsonp: 'callback',
    success: renderPage,
    data: {
      'per_page': 100
    }
  });
})();
