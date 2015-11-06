(function() {
  "use strict";
  angular.module("syncCollectionsDemo").controller("MainCtrl", function($scope, $timeout, $sce, UserCollection, Loader) {
    console.log('ctrl');
    return Loader.load().then(function() {
      return $scope.users = UserCollection.all();
    });
  });

}).call(this);
