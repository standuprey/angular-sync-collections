require "express-mongoose"
express = require "express"
expressHandlebars = require 'express-handlebars'
cookieParser = require 'cookie-parser'
bodyParser = require 'body-parser'
path = require 'path'
session = require 'express-session'
mongoose = require "mongoose"
config = require "./config"
UserController = require './userController'
User = require './userModel'
Counter = require './counterModel'

MongoStore = require('connect-mongo') session
app = express()

models_dir = __dirname + "/app/models"

initApp = ->
	clientDir = path.join __dirname, '../client'
	app.set 'views', clientDir
	app.engine 'handlebars', expressHandlebars()
	app.set 'view engine', 'handlebars'
	app.use express.static clientDir
	app.use express.static path.join(__dirname, '../../.tmp')
	app.use cookieParser()
	app.use bodyParser.urlencoded extended: true
	app.use bodyParser.json()
	app.use session
		store: new MongoStore
			mongooseConnection: mongoose.connection
		secret: config.session.secret
		cookie:
			maxAge: 24192000000
	# Users
	userRouter = express.Router()
	userRouter.route('/')
		.get UserController.index
		.post UserController.create
	userRouter.route('/update').post UserController.update
	userRouter.route('/delete').post UserController.destroy
	userRouter.route('/delete').post UserController.destroy
	# Linking it all together
	app.use '/users', userRouter
	app.get '/counter/:model', (req, res) ->
		Counter.findOne({model: req.params.model}).exec (err, counter) ->
			if counter
				res.status(200).json counter
			else
				res.sendStatus(500)
	# App route
	app.get '/', (req, res) ->
		Counter.findOne({model: "users"}).exec (err, counter) ->
			User.find().exec (err, users) ->
				res.render 'index', {users: users, counter: counter}

	# start
	port = process.env.PORT or 3000
	app.listen port, ->
		console.log "Express listening on port #{port}, running in #{app.settings.env} mode, Node version is: #{process.version}"
		#show all the routes that express-resource creates for you.

console.log "connecting to #{config.db}"
mongoose.connect config.db, (err) ->
	throw err  if err
	initApp()
mongoose.connection.on "connected", ->
	console.log "Mongoose default connection open to " + config.db
mongoose.connection.on "error", (err) ->
	console.log "Mongoose default connection error: " + err
mongoose.connection.on "disconnected", ->
	console.log "Mongoose default connection disconnected"
process.on "SIGINT", ->
	mongoose.connection.close ->
		console.log "Mongoose default connection disconnected through app termination"
		process.exit 0
