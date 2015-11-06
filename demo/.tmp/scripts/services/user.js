(function() {
  "use strict";
  angular.module("syncCollectionsDemo").factory("UserCollection", function(BaseCollection) {
    console.log('BaseCollection.extendAndPersist');
    return BaseCollection.extendAndPersist({
      name: "users"
    });
  });

}).call(this);
