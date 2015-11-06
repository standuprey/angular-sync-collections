"use strict"
angular.module("syncCollectionsDemo").controller "MainCtrl", ($scope, $timeout, $sce, UserCollection, Loader) ->
	Loader.load().then ->
		$scope.users = UserCollection.all()

