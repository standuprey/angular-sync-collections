mongoose = require("mongoose")

countersSchema = new mongoose.Schema
	model: { type: String, unique: true, required: true }
	counter: { type: Number, default: 0 }

countersSchema.statics.inc = (model) ->
	Counter.findOne {model: model}, (err, model) ->
		if model and not err
			model.counter++
			model.save()

Counter = mongoose.model("Counters", countersSchema)
module.exports = Counter