var featured = [
  'forerun',
  'buildbro',
  'spaceman',
  'headsheet'
];
var repoTemplate = $('#repo-template').text();

$.ajax({
  url: 'https://api.github.com/users/wcauchois/repos',
  dataType: 'jsonp',
  crossDomain: true,
  jsonp: 'callback',
  success: renderPage
});

function renderPage(apiResponse) {
  var repos = _.chain(apiResponse.data)
    .filter(function(r) { return !r.fork; })
    .sort(function(r1, r2) {
      return new Date(r2.pushed_at).getTime() -
        new Date(r1.pushed_at).getTime();
    })
    .value();
  var $repoList = $('#repo-list');
  _.each(repos, function(repo) {
    var options = _.extend({}, repo, {featured: featured.indexOf(repo.name) >= 0});
    var $repoEl = $(Mustache.render(repoTemplate, options).trim());
    $repoEl.click(function() {
      location.href = repo.html_url;
    });
    $repoList.append($repoEl);
  });
}

