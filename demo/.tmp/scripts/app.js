(function() {
  "use strict";
  angular.module("syncCollectionsDemo", ["syncCollections", "ngRoute"]).config(function($routeProvider) {
    return $routeProvider.when("/", {
      templateUrl: "views/main.html",
      controller: "MainCtrl"
    }).otherwise({
      redirectTo: "/"
    });
  });

}).call(this);
