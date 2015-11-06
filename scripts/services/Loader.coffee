"use strict"

###*
 # @ngdoc service
 # @name Loader
 # @requires $q
 # @description
 # Service used to get a promise that will be then'd when all the collections are initialized
 #
 # @example

```js
# given we have this service:
angular.module("syncCollections").factory "CategoryCollection", (BaseCollection) ->
	
	# BaseCollection.extendAndPersist calls Loader.addPromise
	BaseCollection.extendAndPersist
		name: "garments"
	
# in the controller...
Loader.load().then ->
	# can now access the garment collection
	garments = CategoryCollection.all()
```
###
angular.module("syncCollections").factory "Loader", ($q, $rootScope) ->
	uiDeferred = promises = loadPromise = null
	init = ->
		loadPromise = null
		promises = []
	init()

	addPromise: (promise) -> promises.push promise
	isLoading: -> promises?.length > 1
	load: ->
		unless loadPromise
			loadPromise = $q.all promises
			loadPromise.then init
		loadPromise
