_ = require "lodash"
mongoose = require "mongoose"
Counter = require "./counterModel"

userSchema = new mongoose.Schema
	phone: String
	name: String

userSchema.methods.assign = (model) ->
	for field in ['phone', 'name']
		@[field] = model[field]  if model[field] isnt `undefined`
	@

Counter.findOne {model: 'users'}, (err, counter) ->
	console.error "Could not initialize counter for users"  if err
	if counter
		console.log "Counter found for users: #{counter.counter}"
	else
		Counter.create {model: 'users'}, (err, counter) ->
			console.log "Initialized counter for users"

module.exports = mongoose.model("Users", userSchema)