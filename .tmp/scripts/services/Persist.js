(function() {
  "use strict";

  /**
    * @ngdoc service
    * @name Persist
    * @requires $q, $http, Config, Loader, Storage
    * @description
    * Service used to retrieve collections from the database
    * This service used to retrieve and persist objects from the Storage.
    * @example
    * # With a model
  ```js
  promise = Persist.init "humans", Human
  promise.then -> humans = Persist.get "humans"
  ```
    * # without default model
  ```js
  config = Persist.init "config"
  config.perPage = 20
  Persist.save config
  ```
    * # delete everything
  ```js
  Persist.reset()
  ```
   */
  angular.module("syncCollections").factory("Persist", function($q, $http, $timeout, $injector, Config, Loader) {
    var Storage, getCounter, persistable;
    Storage = $injector.get(Config.store);
    persistable = {};
    getCounter = function(name) {
      var deferred;
      deferred = $q.defer();
      Storage.get("counter_" + name).then((function(_this) {
        return function(counter) {
          if (counter) {
            counter = parseInt(counter, 10);
          } else {
            counter = 0;
          }
          return deferred.resolve(counter);
        };
      })(this));
      return deferred.promise;
    };
    return {
      reset: function() {
        persistable = {};
        return Storage.reset();
      },
      reload: function() {
        var deferred, k, p, promises;
        promises = [];
        for (k in persistable) {
          p = persistable[k];
          deferred = $q.defer();
          this._checkCounterAndLoad(deferred, p.name, p.modelClass);
          promises.push(deferred.promise);
        }
        return $q.all(promises);
      },
      checkCounters: function() {
        var deferred, k, p, promises;
        promises = [];
        for (k in persistable) {
          p = persistable[k];
          deferred = $q.defer();
          this._checkCounter(deferred, p.name, p.modelClass);
          promises.push(deferred.promise);
        }
        return $q.all(promises);
      },
      init: function(collectionName, Model) {
        var deferred;
        deferred = $q.defer();
        console.log(collectionName, Model);
        this._checkCounterAndLoad(deferred, collectionName, Model);
        Loader.addPromise(deferred.promise);
        return deferred.promise;
      },
      get: function(collectionName) {
        var _ref;
        return ((_ref = persistable[collectionName]) != null ? _ref.collection : void 0) || (function() {
          throw "Collection " + collectionName + " does not exist";
        })();
      },
      _checkCounter: function(deferred, collectionName, Model) {
        return getCounter(collectionName).then((function(_this) {
          return function(counter) {
            return $http.get("" + Config.apiUrl + "/counter/" + collectionName, {
              withCredentials: true,
              timeout: Config.requestTimeout
            }).success(function(remoteCounter) {
              return deferred.resolve(counter === remoteCounter.counter);
            }).error(function() {
              return deferred.reject();
            });
          };
        })(this));
      },
      _checkCounterAndLoad: function(deferred, collectionName, Model) {
        return getCounter(collectionName).then((function(_this) {
          return function(counter) {
            return _this._updateCollection(deferred, collectionName, Model, counter);
          };
        })(this));
      },
      _updateCollection: function(deferred, collectionName, Model, counter, retry) {
        var _ref;
        if (retry == null) {
          retry = 0;
        }
        if (window.cordova && ((_ref = navigator.connection) != null ? _ref.type : void 0) === Connection.NONE) {
          return this._getLocalCollection(deferred, collectionName, Model);
        } else {
          return $http.get("" + Config.apiUrl + "/counter/" + collectionName, {
            withCredentials: true,
            timeout: 2 * Config.requestTimeout
          }).success((function(_this) {
            return function(remoteCounter) {
              if (counter === remoteCounter.counter) {
                return _this._getLocalCollection(deferred, collectionName, Model);
              } else {
                return _this._fetchCollection(deferred, collectionName, Model, remoteCounter.counter);
              }
            };
          })(this)).error((function(_this) {
            return function() {
              if (retry++ < Config.retryCount) {
                console.error("Could not get the counter for " + collectionName + ", retry in 500ms (" + retry + "/" + Config.retryCount + ")");
                return $timeout(function() {
                  return _this._updateCollection(deferred, collectionName, Model, counter, retry);
                }, Config.retryDelay);
              } else {
                console.error("Could not get the counter for " + collectionName + ", you may be offline? Getting local collection");
                return _this._getLocalCollection(deferred, collectionName, Model);
              }
            };
          })(this));
        }
      },
      _fetchCollection: function(deferred, collectionName, Model, counter) {
        return $http.get("" + Config.apiUrl + "/" + collectionName, {
          withCredentials: true,
          timeout: 5 * Config.requestTimeout
        }).success((function(_this) {
          return function(collection) {
            return Storage.set(collectionName, collection, counter).then(function() {
              return _this._getLocalCollection(deferred, collectionName, Model);
            });
          };
        })(this)).error((function(_this) {
          return function() {
            console.error("Could not fetch the collection " + collectionName + ", you may be offline? Getting local collection");
            Storage.set("counter_" + collectionName, 0);
            return _this._getLocalCollection(deferred, collectionName, Model);
          };
        })(this));
      },
      _getLocalCollection: function(deferred, collectionName, Model) {
        return Storage.get(collectionName).then((function(_this) {
          return function(collection) {
            var literal, _i, _len;
            if (persistable[collectionName]) {
              persistable[collectionName].collection.length = 0;
            } else {
              persistable[collectionName] = {
                collection: [],
                modelClass: Model,
                name: collectionName
              };
            }
            if (collection && angular.isArray(collection)) {
              for (_i = 0, _len = collection.length; _i < _len; _i++) {
                literal = collection[_i];
                persistable[collectionName].collection.push(new Model(literal));
              }
            } else {
              Storage.set(collectionName, "[]", 0);
            }
            return deferred.resolve(persistable[collectionName].collection);
          };
        })(this));
      }
    };
  });

}).call(this);
