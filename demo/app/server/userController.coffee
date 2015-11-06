User = require './userModel'
Counter = require './counterModel'

module.exports =
	index: (req, res) ->
		User.find (err, users) ->
			if err
				res.sendStatus(500)
			else
				res.status(200).json users
	create: (req, res) ->
		new User().assign(req.body).save (err, user) ->
			if err
				console.error "create error", err
				res.redirect "/"
			else
				Counter.inc "users"
				res.redirect "/"
	destroy: (req, res) ->
		User.findOne { _id: req.body.userId }, (err, user) ->
			if err or not user
				console.error "destroy (get user) error", err
				res.redirect "/"
			else
				user.remove (err, results) ->
					if err
						console.error "remove error", err
						res.redirect "/"
					else
						Counter.inc "users"
						res.redirect "/"
	update: (req, res) ->
		User.findOne { _id: req.body.userId }, (err, user) ->
			if err or not user
				return res.redirect "/"
			user.assign(req.body).save (err, results) ->
				if err
					console.error "update error", err
					res.redirect "/"
				else
					Counter.inc "users"
					res.redirect "/"
