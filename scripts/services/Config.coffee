"use strict"

###*
 # @ngdoc service
 # @name Config
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
angular.module("syncCollections").factory "Config", ->
	apiUrl: ""
	retryCount: 3
	retryDelay: 500
	requestTimeout: 5000
	store: "PouchDBStorage"