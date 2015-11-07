
/**
  * @ngdoc overview
  * @name angular-sync-collections
  * @requires
  * @description
  * Sync collections between local data storage and your DB
  *
 */

(function() {
  angular.module("syncCollections", []);

}).call(this);
;(function() {
  "use strict";

  /**
    * @ngdoc service
    * @name BaseCollection
    * @requires Persist
    * @description
    * Abstract service providing basic methods to manipulate collections
    *
    * @example
  
  ```js
  	angular.module("syncCollections").factory "Stats", (BaseCollection) ->
  		BaseCollection.extendAndPersist
  			name: "stats"
  ```
   */
  angular.module("syncCollections").factory("BaseCollection", ["Persist", function(Persist) {
    var BaseModel;
    BaseModel = (function() {
      function BaseModel(literal) {
        angular.extend(this, literal);
      }

      BaseModel.prototype.toString = function() {
        var k, properties, v;
        properties = [];
        for (k in this) {
          v = this[k];
          if (k !== "id" && k[0] !== "_" && k[0] !== "$" && (angular.isNumber(v) || angular.isString(v) || angular.isArray(v))) {
            if (angular.isArray(v)) {
              v = "[" + (v.join(",")) + "]";
            }
            properties.push("" + k + ":" + v);
          }
        }
        return properties.join("-");
      };

      return BaseModel;

    })();
    return {
      Model: BaseModel,
      name: "bases",
      extend: function(obj) {
        return angular.extend(angular.extend({}, this), obj);
      },
      extendAndPersist: function(obj) {
        var collection;
        collection = this.extend(obj);
        collection.promise = Persist.init(collection.name, collection.Model);
        return collection;
      },
      all: function() {
        return Persist.get(this.name);
      },
      find: function(value, field) {
        var model, res, _i, _len, _ref;
        if (!((value != null) && (field != null))) {
          return [];
        }
        res = [];
        _ref = this.all();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          if (model[field] === value) {
            res.push(model);
          }
        }
        return res;
      },
      findOne: function(value, field) {
        var model, _i, _len, _ref;
        if (value == null) {
          return null;
        }
        _ref = this.all();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          if (model[field] === value) {
            return model;
          }
        }
        return null;
      }
    };
  }]);

}).call(this);
;(function() {
  "use strict";

  /**
    * @ngdoc service
    * @name BaseFilteredCollection
    * @requires BaseCollection
    * @description
    * base service to add filter capabilities to a collection
    * adds the methods isSelected, resetFilter and toggleFilter
   */
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  angular.module("syncCollections").factory("BaseFilteredCollection", ["BaseCollection", function(BaseCollection) {
    return BaseCollection.extend({
      name: "baseFiltered",
      showAll: true,
      isSelected: function(selection, field) {
        var checkedItems, item, _i, _len;
        if (field == null) {
          field = "name";
        }
        if (this.showAll) {
          return true;
        }
        checkedItems = this.all().filter(function(item) {
          return item.checked;
        }).map(function(item) {
          return item[field];
        });
        if (angular.isArray(selection)) {
          for (_i = 0, _len = selection.length; _i < _len; _i++) {
            item = selection[_i];
            if (__indexOf.call(checkedItems, item) >= 0) {
              return true;
            }
          }
        } else {
          if (__indexOf.call(checkedItems, selection) >= 0) {
            return true;
          }
        }
      },
      resetFilter: function() {
        var item, _i, _len, _ref;
        _ref = this.all();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          item.checked = false;
        }
        return this.showAll = true;
      },
      toggleFilter: function(item) {
        var _i, _len, _ref;
        if (item.checked) {
          item.checked = false;
          _ref = this.all();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            if (item.checked) {
              return;
            }
          }
          return this.showAll = true;
        } else {
          item.checked = true;
          return this.showAll = false;
        }
      }
    });
  }]);

}).call(this);
;(function() {
  "use strict";

  /**
    * @ngdoc service
    * @name Config
    * @requires
    * @description
    * Abstract service providing basic methods to manipulate collections
    *
    * @example
  
  ```js
  	angular.module("syncCollections").factory "Stats", (BaseCollection) ->
  		BaseCollection.extendAndPersist
  			name: "stats"
  ```
   */
  angular.module("syncCollections").factory("Config", function() {
    return {
      apiUrl: "",
      retryCount: 3,
      retryDelay: 500,
      requestTimeout: 5000,
      store: "PouchDBStorage"
    };
  });

}).call(this);
;(function() {
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
  angular.module("syncCollections").factory("Loader", ["$q", "$rootScope", function($q, $rootScope) {
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
  }]);

}).call(this);
;(function() {
  "use strict";

  /**
    * @ngdoc service
    * @name Storage
    * @description
    * Data store using the localStorage object.
    * The limit of Storage being 5MB, this is kind of a naive implementation for now.
   */
  angular.module("syncCollections").factory("LocalStorage", ["$window", "$q", function($window, $q) {
    var _storage;
    _storage = $window.localStorage;
    return {
      _prefix: "lovelooks",
      reset: function() {
        var key;
        for (key in _storage) {
          if (key.indexOf("" + this._prefix + "_") === 0) {
            delete _storage[key];
          }
        }
        return $q(function(resolve) {
          return resolve();
        });
      },
      set: function(key, value, counter) {
        if (angular.isString(value)) {
          _storage["" + this._prefix + "_" + key] = value;
        } else {
          _storage["" + this._prefix + "_" + key] = angular.toJson(value);
        }
        if (counter != null) {
          _storage["" + this._prefix + "_counter_" + key] = counter;
        }
        return $q(function(resolve) {
          return resolve(value);
        });
      },
      get: function(key) {
        var e, rawValue, value;
        rawValue = _storage["" + this._prefix + "_" + key];
        if (rawValue) {
          try {
            value = angular.fromJson(rawValue);
          } catch (_error) {
            e = _error;
            value = rawValue;
          }
        } else {
          value = null;
        }
        return $q(function(resolve) {
          return resolve(value);
        });
      }
    };
  }]);

}).call(this);
;(function() {
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
  angular.module("syncCollections").factory("Persist", ["$q", "$http", "$timeout", "$injector", "Config", "Loader", function($q, $http, $timeout, $injector, Config, Loader) {
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
  }]);

}).call(this);
;(function() {
  "use strict";

  /**
    * @ngdoc service
    * @name Storage
    * @description
    * Data store using PouchDB
   */
  angular.module("syncCollections").factory("PouchDBStorage", ["$q", "$rootScope", function($q, $rootScope) {
    var db;
    db = new PouchDB("lovelooks");
    return {
      reset: function() {
        return $q(function(resolve, reject) {
          return db.destroy(function(err, info) {
            return $rootScope.$apply(function() {
              if (err) {
                return reject("Could not delete the lovelooks db");
              }
              db = new PouchDB("lovelooks");
              return resolve();
            });
          });
        });
      },
      set: function(key, value, counter) {
        if (counter != null) {
          return $q.all([this.set(key, value), this.set("counter_" + key, counter)]);
        } else {
          return $q(function(resolve, reject) {
            return db.get(key, function(err, doc) {
              if (err || !(doc != null ? doc._rev : void 0)) {
                return db.put({
                  collection: value
                }, key, function(err, response) {
                  return $rootScope.$apply(function() {
                    if (err) {
                      return reject(("error setting key " + key + ": ") + err);
                    }
                    return resolve(value);
                  });
                });
              } else {
                return db.put({
                  collection: value
                }, key, doc._rev, function(err, response) {
                  return $rootScope.$apply(function() {
                    if (err) {
                      return reject(("error updating key " + key + ": ") + err);
                    }
                    return resolve(value);
                  });
                });
              }
            });
          });
        }
      },
      get: function(key) {
        return $q(function(resolve, reject) {
          return db.get(key, function(err, doc) {
            return $rootScope.$apply(function() {
              if (err || !(doc != null ? doc._rev : void 0)) {
                return resolve(null);
              }
              return resolve(doc.collection);
            });
          });
        });
      }
    };
  }]);

}).call(this);
