(function() {
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

  angular.module("syncCollections").factory("BaseFilteredCollection", function(BaseCollection) {
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
  });

}).call(this);
