(function() {
  "use strict";

  /**
    * @ngdoc service
    * @name Storage
    * @description
    * Data store using the localStorage object.
    * The limit of Storage being 5MB, this is kind of a naive implementation for now.
   */
  angular.module("syncCollections").factory("LocalStorage", function($window, $q) {
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
  });

}).call(this);
