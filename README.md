Angular-sync-collections
========================

If you want to try and see what this is all about first:
[Demo here!](http://synccollection.herokuapp.com)

What is it?
-----------

It creates a local copy of your database collection that will only request the collection if it has been updated. Obviously, this is not fitting every use case, because if the collection is updated, the whole collection will be requested by the client. But if you collections are not too big and do not get updated too often, this will be a good fit, the client will be faster and the backend load will be lower.

How does it work?
-----------------

When calling Persist.load() the module will check the counter for every collection declared and for each counter that changed it will fetch the collection and put it in the local data store (localStorage or pouchDB)

Install
-------

Copy the angular-sync-collections.js files into your project and add the following line with the correct path:

		<script src="/path/to/scripts/angular-sync-collections.js"></script>
		<link rel="stylesheet" href="/path/to/scripts/angular-sync-collections.css">


Alternatively, if you're using bower, you can add this to your component.json (or bower.json):

		"angular-sync-collections": "~0.0.1"

Or simply run

		bower install angular-sync-collections

Check the dependencies to your html (unless you're using wiredep):

		<script src="components/angular/angular.js"></script>

And:

		<script src="components/angular-sync-collections/angular-sync-collections.js"></script>

If you use pouchDB, you need to add it too (or use bower + grunt wiredep as in the demo to take care of that)

		<script src="bower_components/pouchdb/dist/pouchdb.js"></script>

Add the module to your application

		angular.module("myApp", ["angular-sync-collections"])

SyncCollectionsConfig
--------------------

#### 	apiUrl (default: "")
If you want to make CORS call to request your collections, you need to specify the apiUrl here (and you also need to allow cross-domain header on the server, this could be done with a simple middleware if you use node). Also great if you use this in a phonegap/cordova app for example (I've done it, it works great!). Not that if you're using CORS, set useCredentials to true

#### retryCount (default: 3)
Number of retries when requesting counter/collections

#### retryDelay (default: 500)
Delay between each retry in ms

#### requestTimeout (default: 5000)
Delay after which unanswered request will be considered timeout (in ms)

#### store (default: "PouchDBStorage")
Data store use to store the collections on the client (also available: "LocalStorage")


#### To customize the configuration:

		angular.module("myApp", ["syncCollections"]).run(function(SyncCollectionsConfig){
			SyncCollectionsConfig.store = "LocalStorage";	
		});

#### useCredentials
Needs to be set to true when apiUrl refers to another domain.


Server setup
------------

For each collection you need an endpoint that the library can call to retrieve the collection's item and the collection's counter
For example, if your collection is "users", you will need

		/users
		/counter/users

Every operation that add/deletes/modifies users, need to increment the counter, the counter can never be decremented
See the demo for a simple example with users using node

you can use SyncCollectionsConfig.apiUrl to customize the collection and counter path
if `SyncCollectionsConfig.apiUrl = "api/v1"` the routes for the users collections are

		/api/v1/users
		/api/v1/counter/users

Client setup
------------

Simply create a service that extends BaseCollection:

		angular.module("syncCollectionsDemo").factory("UserCollection", function(BaseCollection){
			return BaseCollection.extendAndPersist({name: "users"});
		});

If you need the additional filtering methods:

		angular.module("syncCollectionsDemo").factory("UserCollection", function(BaseFilteredCollection){
			return BaseFilteredCollection.extendAndPersist({name: "users"});
		});

You can also specify the model and add class and instance methods (I'll explain if need be...)

Then you need to load the collection:

		Persist.load().then(function(){
			// do something	
		})

This can be easily done in your router where you ask to resolve the load before rendering the route

	// Need to make sure all the collection are initialized, so we declare them here as dependencies
	loadInitialData = function(Persist, GarmentCollection, CategoryCollection, ColorCollection, DesignerCollection, StyleCollection){
		return Persist.load();
	}

API
---

BaseCollection methods

		extend(obj)
		extendAndPersist(obj)
		all()
		find(value, field)
		findOne(value, field)

BaseFilteredCollection adds the following

		isSelected(selection, field = "name")
		resetFilter()
		toggleFilter()

Persist service
---------------

You can inject the Persist service to access the following methods
Persist.load(forceResync = true)
Persist.isLoading()
Persist.reset()
Persist.resync()

Demo
----

To run it locally, run:
`npm install & bower install`
build the project
`grunt`
then go to the demo folder
`cd demo`
and install npm and bower again here
`npm install & bower install`
and start the demo
`grunt serve`
You should be able to then go on your browser at localhost:3000

If you want to try and see what this is all about:
[Demo here!](http://synccollection.herokuapp.com)
