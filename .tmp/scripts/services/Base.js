(function() {
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
  angular.module("syncCollections").factory("BaseCollection", function(Persist) {
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
        console.log('extendAndPersist', obj);
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
  });

}).call(this);
