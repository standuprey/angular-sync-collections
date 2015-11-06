"use strict"

###*
 # @ngdoc service
 # @name BaseFilteredCollection
 # @requires BaseCollection
 # @description
 # base service to add filter capabilities to a collection
 # adds the methods isSelected, resetFilter and toggleFilter
###
angular.module("syncCollections").factory "BaseFilteredCollection", (BaseCollection) ->
	
	BaseCollection.extend
		name: "baseFiltered"
		showAll: true
		isSelected: (selection, field = "name") ->
			return true if @showAll
			checkedItems = @all().filter((item) -> item.checked).map((item) -> item[field])
			if angular.isArray selection
				for item in selection
					return true  if item in checkedItems
			else
				return true  if selection in checkedItems
		resetFilter: ->
			item.checked = false  for item in @all()
			@showAll = true
		toggleFilter: (item) ->
			if item.checked
				item.checked = false
				for item in @all()
					return  if item.checked
				@showAll = true
			else
				item.checked = true
				@showAll = false

