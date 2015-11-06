(function() {
  "use strict";

  /**
    * @ngdoc service
    * @name Storage
    * @description
    * Data store using PouchDB
   */
  angular.module("syncCollections").factory("PouchDBStorage", function($q, $rootScope) {
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
  });

}).call(this);
