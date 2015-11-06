"use strict"

###*
 # @ngdoc service
 # @name Storage
 # @description
 # Data store using the localStorage object.
 # The limit of Storage being 5MB, this is kind of a naive implementation for now.
###
angular.module("syncCollections").factory "LocalStorage", ($window, $q) ->
	_storage = $window.localStorage
	_prefix: "lovelooks"
	reset: ->
		for key of _storage
			delete _storage[key] if key.indexOf("#{@_prefix}_") is 0
		$q (resolve) -> resolve()
	set: (key, value, counter) ->
		if angular.isString value
			_storage["#{@_prefix}_#{key}"] = value
		else
			_storage["#{@_prefix}_#{key}"] = angular.toJson value
		if counter?
			_storage["#{@_prefix}_counter_#{key}"] = counter
		$q (resolve) -> resolve value
	get: (key) ->
		rawValue = _storage["#{@_prefix}_#{key}"]
		if rawValue
			try
				value = angular.fromJson rawValue
			catch e
				value = rawValue
		else
			value = null
		$q (resolve) -> resolve value
