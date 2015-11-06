(function() {
  "use strict";

  /**
    * @ngdoc service
    * @name Loader
    * @requires $q
    * @description
    * Service used to get a promise that will be then'd when all the collections are initialized
    *
    * @example
  
  ```js
   * given we have this service:
  angular.module("syncCollections").factory "CategoryCollection", (BaseCollection) ->
  	
  	 * BaseCollection.extendAndPersist calls Loader.addPromise
  	BaseCollection.extendAndPersist
  		name: "garments"
  	
   * in the controller...
  Loader.load().then ->
  	 * can now access the garment collection
  	garments = CategoryCollection.all()
  ```
   */
  angular.module("syncCollections").factory("Loader", function($q, $rootScope) {
    var init, loadPromise, promises, uiDeferred;
    uiDeferred = promises = loadPromise = null;
    init = function() {
      loadPromise = null;
      return promises = [];
    };
    init();
    return {
      addPromise: function(promise) {
        return promises.push(promise);
      },
      isLoading: function() {
        return (promises != null ? promises.length : void 0) > 1;
      },
      load: function() {
        if (!loadPromise) {
          loadPromise = $q.all(promises);
          loadPromise.then(init);
        }
        return loadPromise;
      }
    };
  });

}).call(this);
