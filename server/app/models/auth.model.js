var mongoose = require('mongoose');
var Schema = mongoose.Schema;

authSchema = new Schema({
	name: String,
	password: String,
	user_id: Schema.ObjectId,
	createdAt : { type : Date, default: Date.now },
	modifiedAt : { type : Date, default: Date.now }
}),
users = mongoose.model('user', authSchema);

module.exports = users;