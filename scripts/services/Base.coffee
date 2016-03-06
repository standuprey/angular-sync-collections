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
	argsToQueryArray = (query, field) ->
		if angular.isObject(query)
			queryArray = []
			queryArray.push({key: k, value: v})  for k, v of query
			return queryArray
		else
			if field
				return [{key: field, value: query}] 
			else
				return

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
	find: (query, field) ->
		queryArray = argsToQueryArray(query, field)
		return [] unless queryArray?
		res = []
		for model in @all()
			if queryArray.filter((param) -> model[param.key] isnt param.value).length is 0
				res.push model
		res
	findOne: (query, field) ->
		queryArray = argsToQueryArray(query, field)
		return [] unless queryArray?
		for model in @all()
			if queryArray.filter((param) -> model[param.key] isnt param.value).length is 0
				return model
		null
