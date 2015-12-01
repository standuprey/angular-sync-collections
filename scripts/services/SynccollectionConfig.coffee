"use strict"

###*
 # @ngdoc service
 # @name SyncCollectionsConfig
 # @requires
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
angular.module("syncCollections").factory "SyncCollectionsConfig", ->
	apiUrl: ""
	retryCount: 3
	retryDelay: 500
	requestTimeout: 5000
	store: "PouchDBStorage"
	withCredentials: false
	name: "syncCollections-" + parseInt(Math.random() * 10000000, 10)