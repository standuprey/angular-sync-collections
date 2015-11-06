"use strict"

angular.module("syncCollectionsDemo").factory "UserCollection", (BaseCollection) ->
	BaseCollection.extendAndPersist
		name: "users"
