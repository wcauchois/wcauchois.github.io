var repos = null;
function gotRepos(response) {
  repos = response.data;
  repos.sort(function(repo1, repo2) {
    return new Date(repo2.pushed_at).getTime() -
      new Date(repo1.pushed_at).getTime();
  });
}
$(document).ready(function() {
  var repoTemplate = $('#repo-template').text();
  var $reposContainer = $('#repos-container');
  for (var i = 0; i < repos.length; i++) {
    var repo = repos[i];
    var $repoDiv = $('<div class="repo"></div>');
    $repoDiv.html(Mustache.render(repoTemplate, repo));
    (function() {
      var html_url = repo.html_url;
      $repoDiv.click(function() {
        location.href = html_url;
      });
    })();
    $reposContainer.append($repoDiv);
  }
});
