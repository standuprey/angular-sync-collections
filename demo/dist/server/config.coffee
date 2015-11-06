module.exports = do ->
	config =
		global:
			session:
				db: "sessions"
				secret: "sUp3r_sEcret"

		development:
			origins: ["http://localhost:3000"]
			db: "mongodb://localhost/synccollections"
			app:
				name: "synccollections dev"

		production:
			origins: ["http://synccollections.herokuapp.com", "http://localhost:3000"]
			db: process.env.MONGOLAB_URI
			app:
				name: "synccollections"

	settings = config.global
	env = process.env.NODE_ENV or "development"
	settings.env = env
	env = "production"  if env is "test"
	settings[key] = value for key, value of config[env]

	settings