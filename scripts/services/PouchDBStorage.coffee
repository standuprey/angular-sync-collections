"use strict"

###*
 # @ngdoc service
 # @name Storage
 # @description
 # Data store using PouchDB
###
angular.module("syncCollections").factory "PouchDBStorage", ($q, $rootScope, SyncCollectionsConfig) ->
	db = new PouchDB SyncCollectionsConfig.name
	reset: ->
		$q (resolve, reject) ->
			db.destroy (err, info) ->
				$rootScope.$apply ->
					return reject("Could not delete the db: " + SyncCollectionsConfig.name) if err
					db = new PouchDB SyncCollectionsConfig.name
					resolve()
	set: (key, value, counter) ->
		if counter?
			$q.all [@set(key, value), @set("counter_#{key}", counter)]
		else
			$q (resolve, reject) ->
				db.get key, (err, doc) ->
					if err or !doc?._rev
						db.put { collection: value }, key, (err, response) ->
							$rootScope.$apply ->
								return reject("error setting key #{key}: " + err) if err
								resolve value
					else
						db.put { collection: value }, key, doc._rev, (err, response) ->
							$rootScope.$apply ->
								return reject("error updating key #{key}: " + err) if err
								resolve value
	get: (key) ->
		$q (resolve, reject) ->
			db.get key, (err, doc) ->
				$rootScope.$apply ->
					return resolve(null) if err or !doc?._rev
					resolve doc.collection
