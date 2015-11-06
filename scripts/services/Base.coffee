"use strict"

###*
 # @ngdoc service
 # @name BaseCollection
 # @requires Persist
 # @description
 # Abstract service providing basic methods to manipulate collections
 #
 # @example

```js
	angular.module("syncCollections").factory "Stats", (BaseCollection) ->
		BaseCollection.extendAndPersist
			name: "stats"
```
###
angular.module("syncCollections").factory "BaseCollection", (Persist) ->
	class BaseModel
		constructor: (literal) ->
			angular.extend this, literal
		toString: ->
			properties = []
			for k, v of @
				if k isnt "id" and k[0] isnt "_" and k[0] isnt "$" and (angular.isNumber(v) or angular.isString(v) or angular.isArray(v))
					v = "[#{v.join ","}]"  if angular.isArray v
					properties.push "#{k}:#{v}"
			properties.join "-"

	Model: BaseModel
	name: "bases"
	extend: (obj) -> angular.extend angular.extend({}, @), obj
	extendAndPersist: (obj) ->
		collection = @extend obj
		collection.promise = Persist.init collection.name, collection.Model
		collection
	all: -> Persist.get @name
	find: (value, field) ->
		return [] unless value? and field?
		res = []
		for model in @all()
			if model[field] is value
				res.push model
		res
	findOne: (value, field) ->
		return null unless value?
		for model in @all()
			if model[field] is value
				return model
		null
