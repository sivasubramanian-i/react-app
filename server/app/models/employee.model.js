var mongoose = require('mongoose');
var Schema = mongoose.Schema;

employeeSchema = new Schema({
	name: String,
	email: String,
	age: String,
	address: String,
	mobile: String,
	employee_id: Schema.ObjectId,
	createdAt : { type : Date, default: Date.now },
	modifiedAt : { type : Date, default: Date.now }
}),
employees = mongoose.model('employees', employeeSchema);

module.exports = employees;