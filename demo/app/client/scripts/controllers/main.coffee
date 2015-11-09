"use strict"
angular.module("syncCollectionsDemo").controller "MainCtrl", ($scope, $timeout, $sce, UserCollection, Persist) ->
	Persist.load().then ->
		$scope.users = UserCollection.all()

